import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import DaysOfWeekSelector from "./DaysOfWeekSelector";
import { updateEmployeeSchedule } from "@/services";

export default function EmployeeScheduleCard({ employee, schedule }) {
  const [workDays, setWorkDays] = useState(schedule?.workDays || []);
  const [startTime, setStartTime] = useState(schedule?.startTime || "");
  const [endTime, setEndTime] = useState(schedule?.endTime || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateEmployeeSchedule(schedule.id, {
      workDays,
      startTime,
      endTime,
    });
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{employee.name}</CardTitle>
        <Badge variant={employee.role}>{employee.role}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <DaysOfWeekSelector selectedDays={workDays} onChange={setWorkDays} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={startTime || ""}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={endTime || ""}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Schedule"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
