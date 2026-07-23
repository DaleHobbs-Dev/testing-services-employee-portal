import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Select,
} from "@/components";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";

const getCalendarEmployeeId = (calendar) =>
  calendar.employeeId ??
  calendar.employee?.id ??
  calendar.ownerId ??
  calendar.owner?.id;

const buildEmployeeOptions = (employees) => {
  const optionsById = new Map();

  employees.forEach((employee) => {
    optionsById.set(String(employee.id), employee);
  });

  return Array.from(optionsById.values());
};

const getOwnerName = (calendar, employees) => {
  const employeeId = getCalendarEmployeeId(calendar);
  const employee = employees.find(
    (item) => String(item.id) === String(employeeId)
  );

  return (
    calendar.employeeName ||
    calendar.employeeFullName ||
    (calendar.employee ? getEmployeeDisplayName(calendar.employee) : "") ||
    (calendar.owner ? getEmployeeDisplayName(calendar.owner) : "") ||
    (employee ? getEmployeeDisplayName(employee) : "")
  );
};

export function CalendarSelector({
  calendars = [],
  selectedCalendarId,
  onSelect,
  title = "Calendars",
  emptyMessage = "No calendars found.",
  allowDelete = false,
  isDeleteMode = false,
  markedCalendarIds = [],
  onToggleDeleteMode,
  onToggleMarkedCalendar,
  onDeleteMarkedCalendars,
  isDeleting = false,
  employees = [],
  showEmployeeFilter = false,
  employeeFilterValue = "",
  onEmployeeFilterChange,
  onEditCalendar,
}) {
  const markedCount = markedCalendarIds.length;
  const employeeOptions = buildEmployeeOptions(employees);
  const visibleCalendars =
    showEmployeeFilter && employeeFilterValue
      ? calendars.filter(
          (calendar) =>
            String(getCalendarEmployeeId(calendar)) ===
            String(employeeFilterValue)
        )
      : calendars;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          {allowDelete && calendars.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              className="px-2 py-1 text-sm"
              onClick={onToggleDeleteMode}
            >
              {isDeleteMode ? "Cancel" : "Delete Calendars"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showEmployeeFilter && (
          <FormField label="Employee">
            <Select
              value={employeeFilterValue}
              onChange={(event) => onEmployeeFilterChange?.(event.target.value)}
            >
              <option value="">All employees</option>
              {employeeOptions.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {getEmployeeDisplayName(employee)}
                </option>
              ))}
            </Select>
          </FormField>
        )}

        {isDeleteMode && (
          <div className="mb-4 rounded-lg border border-danger-500/40 bg-red-50 p-3 dark:bg-red-900/30">
            <p className="text-sm font-medium text-red-800 dark:text-red-100">
              Mark calendars to delete.
            </p>
            <Button
              type="button"
              variant="danger"
              className="mt-3 w-full shadow-sm shadow-red-900/20 dark:shadow-red-500/20"
              onClick={onDeleteMarkedCalendars}
              disabled={markedCount === 0 || isDeleting}
            >
              {isDeleting
                ? "Deleting..."
                : `Delete Marked Calendars${
                    markedCount > 0 ? ` (${markedCount})` : ""
                  }`}
            </Button>
          </div>
        )}

        {visibleCalendars.length === 0 ? (
          <p className="text-sm text-adaptive-muted">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {visibleCalendars.map((calendar) => {
              const isSelected =
                String(calendar.id) === String(selectedCalendarId);
              const ownerName = getOwnerName(calendar, employees);
              const isMarked = markedCalendarIds
                .map(String)
                .includes(String(calendar.id));

              return (
                <div
                  key={calendar.id}
                  className={`
                    w-full rounded-lg border p-2 pb-0 transition
                    ${
                      isSelected
                        ? "border-primary bg-primary-light/20"
                        : "border-adaptive hover:border-primary"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {isDeleteMode && (
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={isMarked}
                        onChange={() => onToggleMarkedCalendar(calendar.id)}
                        aria-label={`Mark ${calendar.name} for deletion`}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => !isDeleteMode && onSelect(calendar)}
                      disabled={isDeleteMode}
                      className="flex-1 text-left disabled:cursor-default"
                    >
                      <div className="flex min-h-20 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-adaptive">
                              {calendar.name}
                            </p>
                            <p className="text-sm text-adaptive-muted">
                              {calendar.year} - Months {calendar.startMonth}-
                              {calendar.endMonth}
                            </p>
                          </div>
                          {isSelected && !isDeleteMode && (
                            <Badge variant="primary">Selected</Badge>
                          )}
                        </div>
                        {ownerName && (
                          <p className="text-xs font-medium text-adaptive">
                            Owner: {ownerName}
                          </p>
                        )}
                      </div>
                    </button>
                    {!isDeleteMode && (
                      <button
                        type="button"
                        onClick={() => onEditCalendar?.(calendar)}
                        className="rounded-md p-1.5 text-adaptive-muted transition hover:bg-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={`Edit ${calendar.name}`}
                        title={`Edit ${calendar.name}`}
                      >
                        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                    {!isDeleteMode && isSelected && (
                      <span className="sr-only">Selected</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button to="/calendar-management" variant="ghost" className="mt-4">
          Back to Calendar Menu
        </Button>
      </CardContent>
    </Card>
  );
}
