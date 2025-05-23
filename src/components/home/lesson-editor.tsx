"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

export default function LessonEditor({ content, setContent }: { content: string, setContent: (value: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      Paragraph,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.clearContent(true);
    }
  }, [content]);

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div className="w-full h-[300px] flex flex-col border rounded-lg bg-white shadow-md">
      {/* Toolbar */}
      <div className="flex gap-2 border-b p-2 bg-gray-100">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${editor.isActive("bold") ? "bg-gray-300" : "bg-gray-100"} hover:bg-gray-200`}
        >
          <b>B</b>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${editor.isActive("italic") ? "bg-gray-300" : "bg-gray-100"} hover:bg-gray-200`}
        >
          <i>I</i>
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-3 py-1 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : "bg-gray-100"} hover:bg-gray-200`}
        >
          Left
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-3 py-1 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : "bg-gray-100"} hover:bg-gray-200`}
        >
          Center
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-3 py-1 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : "bg-gray-100"} hover:bg-gray-200`}
        >
          Right
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-2">
        <EditorContent
          editor={editor}
          className="prose w-full h-full min-h-[250px] p-4 border rounded-md focus:outline-none"
        />
      </div>
    </div>
  );
}
