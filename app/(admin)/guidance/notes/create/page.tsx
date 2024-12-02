import { NotesForm } from "@/components/forms/DisciplinaryNoteForm";

export default function CreateDisciplinaryNotesPage() {
  return (
    <main>
      <div className="bg-white rounded-md w-[80%] p-10">
        <h1 className="text-2xl font-bold text-primary mb-10">Disciplinary Note</h1>
        <NotesForm />
      </div>
    </main>
  )
}
