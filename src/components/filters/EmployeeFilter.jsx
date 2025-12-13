// components/filters/EmployeeFilter.jsx
import { Select, Label } from "@/components/ui";

export default function EmployeeFilter({ employees, value, onChange }) {
  return (
    <div className="max-w-xs">
      <Label htmlFor="employeeFilter">Filter by Proctor</Label>
      <Select
        id="employeeFilter"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">All Proctors</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
