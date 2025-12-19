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
        className="
    border border-gray-300 dark:border-gray-600 
    rounded-md p-2 w-full max-w-xs
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100
    focus:ring-2 focus:ring-primary focus:outline-none 
    transition-colors
    [color-scheme:light] dark:[color-scheme:dark]
  "
      />
    </div>
  );
}
