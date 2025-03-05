"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

type ValidHeadingLevel = 1 | 2 | 3;

interface TiptapProps {
  content: string;
  setContent: (content: string) => void;
}

const Tiptap = ({ content, setContent }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ 
        levels: [1, 2, 3]
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const toggleHeading = useCallback((level: ValidHeadingLevel) => {
    if (!editor) return;

    // Check if there's a text selection
    if (editor.state.selection.empty) {
      // If no text is selected, apply the heading to the current block
      editor.chain()
        .focus()
        .toggleHeading({ level })
        .run();
    } else {
      // If text is selected, wrap the selected text in a heading
      editor.chain()
        .focus()
        .setHeading({ level })
        .run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border p-4 rounded-md shadow-sm bg-[#313244] text-[#cdd6f4]">
      <div className="flex gap-2 mb-3 border-b pb-2">
        {([1, 2, 3] as const).map((level) => (
          <Button
            key={level}
            onClick={() => toggleHeading(level)}
            variant={editor.isActive('heading', { level }) ? "default" : "outline"}
            aria-label={`Heading ${level}`}
          >
            H{level}
          </Button>
        ))}
      </div>
      
      <EditorContent editor={editor} className="ProseMirror min-h-[200px] p-4" />
    </div>
  );
};

export default Tiptap;