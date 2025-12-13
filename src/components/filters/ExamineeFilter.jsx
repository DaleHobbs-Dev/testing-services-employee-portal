// components/filters/ExamineeFilter.jsx
import { Input, Label } from "@/components/ui";

export default function ExamineeFilter({ value, onChange }) {
  return (
    <div className="max-w-xs">
      <Label htmlFor="examineeFilter">Search Examinee</Label>
      <Input
        id="examineeFilter"
        type="text"
        placeholder="Examinee name…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
