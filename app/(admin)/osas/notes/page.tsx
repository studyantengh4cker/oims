import { getStudentsWithDisciplinaryNotes } from "@/actions/note.action";
import { DisciplinaryNotesCards } from "@/components/admin/NotesCards";
import NotesCollegeData from "./NotesCollegeData";

export default async function DisciplinaryNotesPage() {
  const notes = await getStudentsWithDisciplinaryNotes();

  return (
    <main>
      <h1 className="text-2xl font-bold text-primary mb-10">
        Disciplinary Notes
      </h1>
      <NotesCollegeData students={notes} />
      <DisciplinaryNotesCards students={notes} />
    </main>
  );
}
