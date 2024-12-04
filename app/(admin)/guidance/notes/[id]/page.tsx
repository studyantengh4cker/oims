import { getNotesByStudentId } from "@/actions/note.action";
import { NotesForm } from "@/components/forms/DisciplinaryNoteForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NotePage({ params }: { params: any }) {
  if (!params) return null;

  const student = await getNotesByStudentId(params.id);
  if (!student) return <>Admission not found</>;

  const data = {
    ...student,
    middleName: student.middleName || undefined,
    disciplinaryNotes: student.disciplinaryNotes.map((note) => ({
      ...note,
      dateGiven: new Date(note.dateGiven).toISOString().slice(0, 16),
    })),
  };

  return (
    <main className="p-10">
      <Button variant="link" asChild>
        <Link href="/guidance/notes">Back</Link>
      </Button>
      <h1 className="text-lg font-bold mb-4 text-primary">Note</h1>
      <NotesForm defaultValues={data} />
    </main>
  );
}
