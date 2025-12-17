import { H2, Textarea } from "@/components/ui";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function AppointmentNotes({ value, onChange }) {
  return (
    <>
      <H2 className="mt-8 mb-3">
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          <DocumentTextIcon className="w-8 h-8 text-primary" />
          Optional Exam Notes
        </div>
      </H2>
      <Textarea
        placeholder="Add special instructions..."
        value={value}
        onChange={onChange}
      />
    </>
  );
}
