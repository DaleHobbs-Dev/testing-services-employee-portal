import { Label, Input } from "@/components/ui";

export default function AppointmentDatePicker({ date, onChange }) {
  const formattedDate = date.toISOString().slice(0, 10);

  return (
    <div className="mb-6">
      <Label>Select Date</Label>
      <Input
        type="date"
        value={formattedDate}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="max-w-xs"
      />
    </div>
  );
}
