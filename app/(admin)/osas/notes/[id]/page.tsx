import { getNotesByStudentId } from "@/actions/note.action";
import { NotesForm } from "@/components/forms/DisciplinaryNoteForm";

export default async function NotePage({ params }: { params: any }) {
    if (!params) return null;

  const student = await getNotesByStudentId(params.id);
  if (!student) return <>Admission not found</>;

  const data = {
    ...student,
    middleName: student.middleName || undefined,
    disciplinaryNotes: student.disciplinaryNotes.map(note => ({
        ...note,
        dateGiven: new Date(note.dateGiven).toISOString().slice(0, 16)
    }))
}

  return (
    <main>
        <NotesForm defaultValues={data} />
    </main>
  )
}
