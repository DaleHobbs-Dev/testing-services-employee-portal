import { FormField, Select } from "@/components";

export function CalendarFilterBar({
  filters,
  onChange,
  locations = [],
  testFamilies = [],
  employees = [],
  showEmployeeFilter = true,
  showMyScheduleToggle = false,
}) {
  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const updateBooleanFilter = (name) => {
    onChange({ ...filters, [name]: !filters[name] });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <FormField label="Location">
        <Select
          value={filters.locationId}
          onChange={(event) => updateFilter("locationId", event.target.value)}
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Test Family">
        <Select
          value={filters.testFamilyId}
          onChange={(event) => updateFilter("testFamilyId", event.target.value)}
        >
          <option value="">All test families</option>
          {testFamilies.map((testFamily) => (
            <option key={testFamily.id} value={testFamily.id}>
              {testFamily.name || testFamily.label}
            </option>
          ))}
        </Select>
      </FormField>

      {showEmployeeFilter && (
        <FormField label="Employee">
          <Select
            value={filters.employeeId}
            onChange={(event) => updateFilter("employeeId", event.target.value)}
          >
            <option value="">All employees</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <label className="flex items-center gap-2 text-sm text-adaptive">
        <input
          type="checkbox"
          checked={filters.showLabels}
          onChange={() => updateBooleanFilter("showLabels")}
        />
        Labels
      </label>

      <label className="flex items-center gap-2 text-sm text-adaptive">
        <input
          type="checkbox"
          checked={filters.showHoursColumn}
          onChange={() => updateBooleanFilter("showHoursColumn")}
        />
        Hours column
      </label>

      <label className="flex items-center gap-2 text-sm text-adaptive">
        <input
          type="checkbox"
          checked={filters.showNotes}
          onChange={() => updateBooleanFilter("showNotes")}
        />
        Notes
      </label>

      {showMyScheduleToggle && (
        <label className="flex items-center gap-2 text-sm text-adaptive">
          <input
            type="checkbox"
            checked={filters.showMySchedule}
            onChange={() => updateBooleanFilter("showMySchedule")}
          />
          Show my schedule
        </label>
      )}
    </div>
  );
}
