import { ProtectedRoute } from "@/components/ProtectedRoute";
import NoteCard from "@/components/home/note-card";
import Tiptap from "@/components/Tiptap";
const notes = [
  { title: "Edit NFT landing page", description: "A big project with a minimal design. asd asd asd asdas dasd assssdas da asd as dad a d a sads ad a ad asdasdasd qw asd asd dwqdasdaaasda das dasd asd asd asdasdasa asdasda d ad ada dasd asda d asda sda d asdads asdad asd", date: "2023/02/06" },
  { title: "Meeting with the team", description: "Discuss project progress.", date: "2023/02/05" },
  { title: "Edit dribbble shot", date: "2023/02/03" },
  { title: "Design sprint training", date: "2023/02/05" },
  { title: "Brainstorming for logo", date: "2023/02/03" },
  { title: "Complete design system", description: "Navigation bars, Date pickers", date: "2023/02/04" },
];

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


        {/* Notes section */}
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4 md:min-h-min">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, index) => (
              <NoteCard key={index} {...note} />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
