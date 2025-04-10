import { ProtectedRoute } from "@/components/ProtectedRoute";
import NoteCard from "@/components/home/note-card";
import Tiptap from "@/components/Tiptap";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Top section with placeholders */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="h-40 rounded-xl bg-muted/50">
          
          </div>
          <div className="h-40 rounded-xl bg-muted/50" />
          <div className="h-40 rounded-xl bg-muted/50" />
        </div>


      </div>
    </ProtectedRoute>
  );
}
