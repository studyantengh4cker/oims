import { getStudentsWithDisciplinaryNotes } from "@/actions/note.action";
import { DisciplinaryNotesCards } from "@/components/admin/NotesCards";
import NotesCollegeData from "./NotesCollegeData";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DisciplinaryNotesPage() {
  const notes = await getStudentsWithDisciplinaryNotes();

  return (
    <main>
      <div className="flex items-center gap-4 mb-4">
        <Button asChild>
          <Link href={"/osas/notes/create"}>Create Note</Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Disciplinary Notes</h1>
      </div>
      <NotesCollegeData students={notes} />
      <DisciplinaryNotesCards students={notes} />
    </main>
  );
}
