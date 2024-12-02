import { getStudentsWithDisciplinaryNotes } from "@/actions/note.action"
import { DisciplinaryNotesCards } from "@/components/admin/NotesCards";

export default async function DisciplinaryNotesPage() {

  const notes = await getStudentsWithDisciplinaryNotes();

  return (
    <main>
      <h1 className="text-2xl font-bold text-primary mb-10">Disciplinary Notes</h1>
      <DisciplinaryNotesCards students={notes} />
    </main>
  )
}
