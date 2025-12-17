import { H3, Label, Input } from "@/components/ui";

export default function FacultyTestFields({ facultyData, onChange }) {
  return (
    <div className="mt-6">
      <H3>Faculty Test Details</H3>

      <Label className="mt-3">Exam Title</Label>
      <Input
        value={facultyData.title}
        onChange={(e) => onChange({ ...facultyData, title: e.target.value })}
      />

      <Label className="mt-3">Faculty Name</Label>
      <Input
        value={facultyData.facultyName}
        onChange={(e) =>
          onChange({ ...facultyData, facultyName: e.target.value })
        }
      />

      <Label className="mt-3">Course</Label>
      <Input
        value={facultyData.course}
        onChange={(e) => onChange({ ...facultyData, course: e.target.value })}
      />

      <Label className="mt-3">Duration (minutes)</Label>
      <Input
        type="number"
        value={facultyData.duration}
        onChange={(e) => onChange({ ...facultyData, duration: e.target.value })}
      />
    </div>
  );
}
