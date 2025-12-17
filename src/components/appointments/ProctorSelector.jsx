import { H2, Select } from "@/components/ui";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ProctorSelector({
  employees,
  selectedProctorId,
  onChange,
}) {
  return (
    <>
      <H2 className="mt-8 mb-4">
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          <UserCircleIcon className="w-8 h-8 text-primary" />
          Proctor
        </div>
      </H2>
      <Select value={selectedProctorId || ""} onChange={onChange}>
        <option value="">Select Proctor</option>
        {employees
          .filter((e) => e.role === "proctor" || e.role === "admin")
          .filter((e) => e.status === "active")
          .map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
      </Select>
    </>
  );
}
