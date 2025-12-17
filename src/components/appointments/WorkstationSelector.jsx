import { H2, Select, Alert } from "@/components/ui";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

export default function WorkstationSelector({
  workstations,
  selectedWorkstationId,
  selectedLocationId,
  onChange,
}) {
  // Filter workstations by location
  const availableWorkstations = selectedLocationId
    ? workstations.filter((ws) => ws.locationId === Number(selectedLocationId))
    : [];

  return (
    <>
      <H2 className="mt-8 mb-4">
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          <ComputerDesktopIcon className="w-8 h-8 text-primary" />
          Workstation
        </div>
      </H2>

      {!selectedLocationId ? (
        <Alert variant="info" className="text-sm">
          Please select a location first to see available workstations.
        </Alert>
      ) : availableWorkstations.length === 0 ? (
        <Alert variant="warning" className="text-sm">
          No workstations available at this location.
        </Alert>
      ) : (
        <Select value={selectedWorkstationId || ""} onChange={onChange}>
          <option value="">Select Workstation</option>
          {availableWorkstations.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.label} — {ws.room}
            </option>
          ))}
        </Select>
      )}
    </>
  );
}
