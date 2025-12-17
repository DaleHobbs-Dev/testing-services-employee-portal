import { H2, Select } from "@/components/ui";
import { MapPinIcon } from "@heroicons/react/24/outline";

export default function LocationSelector({
  locations,
  selectedLocationId,
  onChange,
}) {
  return (
    <>
      <H2 className="mt-8 mb-4">
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          <MapPinIcon className="w-8 h-8 text-primary" />
          Testing Center Location
        </div>
      </H2>
      <Select value={selectedLocationId || ""} onChange={onChange}>
        <option value="">Select Location</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name} {location.building && `— ${location.building}`}
          </option>
        ))}
      </Select>
    </>
  );
}
