import { FormField, Select } from "@/components";
import { CLOSURE_TYPES } from "@/components/calendar/utils/closureTypes";
import { NONE_FILTER_VALUE } from "@/components/calendar/utils/filterValues";
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
  const selectedClosureTypes =
    filters.closureTypes || CLOSURE_TYPES.map((closureType) => closureType.value);

  const updateFilter = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  const getSelectedValues = (name) =>
    Array.isArray(filters[name]) ? filters[name].map(String) : [];

  const updateMultiFilter = (name, value) => {
    const selectedValues = getSelectedValues(name);
    const stringValue = String(value);
    const nextValues = selectedValues.includes(stringValue)
      ? selectedValues.filter((selectedValue) => selectedValue !== stringValue)
      : [...selectedValues, stringValue];

    onChange({ ...filters, [name]: nextValues.length > 0 ? nextValues : "" });
  };

  const updateBooleanFilter = (name) => {
    onChange({ ...filters, [name]: !filters[name] });
  };

  const toggleClosureType = (closureType) => {
    const nextClosureTypes = selectedClosureTypes.includes(closureType)
      ? selectedClosureTypes.filter((type) => type !== closureType)
      : [...selectedClosureTypes, closureType];

    onChange({ ...filters, closureTypes: nextClosureTypes });
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div>
          <p className="mb-2 text-sm font-medium text-adaptive">
            Closure Type
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {CLOSURE_TYPES.map((closureType) => (
              <label
                key={closureType.value}
                className="flex items-center gap-2 text-sm text-adaptive"
              >
                <input
                  type="checkbox"
                  checked={selectedClosureTypes.includes(closureType.value)}
                  onChange={() => toggleClosureType(closureType.value)}
                />
                {closureType.label}
              </label>
            ))}
          </div>
        </div>
      )}

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
            <div className="rounded-md border border-adaptive bg-adaptive p-3">
              <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
                <label className="flex items-center gap-2 text-sm text-adaptive">
                  <input
                    type="radio"
                    checked={filters.testFamilyId === ""}
                    onChange={() => updateFilter("testFamilyId", "")}
                  />
                  All
                </label>
                <label className="flex items-center gap-2 text-sm text-adaptive">
                  <input
                    type="radio"
                    checked={filters.testFamilyId === NONE_FILTER_VALUE}
                    onChange={() =>
                      updateFilter("testFamilyId", NONE_FILTER_VALUE)
                    }
                  />
                  None
                </label>
              </div>
              <div className="max-h-32 space-y-2 overflow-y-auto pr-1">
                {testFamilies.map((testFamily) => (
                  <label
                    key={testFamily.id}
                    className="flex items-center gap-2 text-sm text-adaptive"
                  >
                    <input
                      type="checkbox"
                      checked={getSelectedValues("testFamilyId").includes(
                        String(testFamily.id)
                      )}
                      onChange={() =>
                        updateMultiFilter("testFamilyId", testFamily.id)
                      }
                    />
                    {testFamily.name || testFamily.label}
                  </label>
                ))}
              </div>
            </div>
          </FormField>

          {showEmployeeFilter && (
            <FormField label="Employee">
              <div className="rounded-md border border-adaptive bg-adaptive p-3">
                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
                  <label className="flex items-center gap-2 text-sm text-adaptive">
                    <input
                      type="radio"
                      checked={filters.employeeId === ""}
                      onChange={() => updateFilter("employeeId", "")}
                    />
                    All
                  </label>
                  <label className="flex items-center gap-2 text-sm text-adaptive">
                    <input
                      type="radio"
                      checked={filters.employeeId === NONE_FILTER_VALUE}
                      onChange={() =>
                        updateFilter("employeeId", NONE_FILTER_VALUE)
                      }
                    />
                    None
                  </label>
                </div>
                <div className="max-h-32 space-y-2 overflow-y-auto pr-1">
                  {employees.map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center gap-2 text-sm text-adaptive"
                    >
                      <input
                        type="checkbox"
                        checked={getSelectedValues("employeeId").includes(
                          String(employee.id)
                        )}
                        onChange={() =>
                          updateMultiFilter("employeeId", employee.id)
                        }
                      />
                      {getEmployeeDisplayName(employee)}
                    </label>
                  ))}
                </div>
              </div>
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
