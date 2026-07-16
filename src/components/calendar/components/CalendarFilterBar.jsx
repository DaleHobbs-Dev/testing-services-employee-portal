import { FormField, Select } from "@/components";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";

export function CalendarFilterBar({
  filters,
  onChange,
  locations = [],
  testFamilies = [],
  employees = [],
  showEmployeeFilter = true,
  showMyScheduleToggle = false,
  showFilters = true,
  showToggles = true,
  filterClassName = "grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4",
  toggleClassName = "flex flex-wrap gap-x-6 gap-y-3",
}) {
  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const updateBooleanFilter = (name) => {
    onChange({ ...filters, [name]: !filters[name] });
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className={filterClassName}>
          <FormField label="Location">
            <Select
              value={filters.locationId}
              onChange={(event) =>
                updateFilter("locationId", event.target.value)
              }
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Test Type">
            <Select
              value={filters.testFamilyId}
              onChange={(event) =>
                updateFilter("testFamilyId", event.target.value)
              }
            >
              <option value="">All</option>
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
                onChange={(event) =>
                  updateFilter("employeeId", event.target.value)
                }
              >
                <option value="">All</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {getEmployeeDisplayName(employee)}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        </div>
      )}

      {showToggles && (
        <div className={toggleClassName}>
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

          <label className="flex items-center gap-2 text-sm text-adaptive">
            <input
              type="checkbox"
              checked={filters.showHoursColumn}
              onChange={() => updateBooleanFilter("showHoursColumn")}
            />
            Hours Column
          </label>
        </div>
      )}
    </div>
  );
}
