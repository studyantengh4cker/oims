import { getStudentsWithDisciplinaryNotes } from "@/actions/note.action";
import { DisciplinaryNotesCards } from "@/components/admin/NotesCards";
import NotesCollegeData from "./NotesCollegeData";
import { FormModal } from "@/components/admin/FormModal";
import { NotesForm } from "@/components/forms/DisciplinaryNoteForm";

export default async function DisciplinaryNotesPage() {
  const notes = await getStudentsWithDisciplinaryNotes();

  return (
    <main>
      <div className="flex items-center gap-4 mb-4">
        <FormModal title="Create Note">
          <NotesForm />
        </FormModal>
        <h1 className="text-2xl font-bold text-primary">Disciplinary Notes</h1>
      </div>
      <NotesCollegeData students={notes} />
      <DisciplinaryNotesCards students={notes} />
    </main>
  );
}
