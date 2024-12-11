import { NotesForm } from "@/components/forms/DisciplinaryNoteForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateDisciplinaryNotesPage() {
  return (
    <main>
      <Button asChild variant="link">
        <Link href="/osas/notes">Back</Link>
      </Button>
      <div className="bg-white rounded-md w-[80%] p-10">
        <h1 className="text-2xl font-bold text-primary mb-10">
          Disciplinary Note
        </h1>
        <NotesForm />
      </div>
    </main>
  );
}
