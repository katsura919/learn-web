import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Copy, Archive } from "lucide-react";

interface NoteCardProps {
  title: string;
  description?: string;
  date: string;
  actions?: boolean;
}

export default function NoteCard({ title, description, date, actions = true }: NoteCardProps) {
  return (
    <Card className="p-4 flex flex-col justify-between shadow-md bg-muted">
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-muted-foreground">{date}</span>
        {actions && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
