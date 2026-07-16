import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";

const getOwnerName = (calendar) =>
  calendar.employeeName ||
  (calendar.employee ? getEmployeeDisplayName(calendar.employee) : "") ||
  (calendar.owner ? getEmployeeDisplayName(calendar.owner) : "");

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
}) {
  const markedCount = markedCalendarIds.length;

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
        {isDeleteMode && (
          <div className="mb-4 rounded-lg border border-danger-500/30 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">
              Mark calendars to delete.
            </p>
            <Button
              type="button"
              variant="danger"
              className="mt-3 w-full"
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

        {calendars.length === 0 ? (
          <p className="text-sm text-adaptive-muted">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {calendars.map((calendar) => {
              const isSelected = String(calendar.id) === String(selectedCalendarId);
              const ownerName = getOwnerName(calendar);
              const isMarked = markedCalendarIds
                .map(String)
                .includes(String(calendar.id));

              return (
                <div
                  key={calendar.id}
                  className={`
                    w-full rounded-lg border p-4 transition
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
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-adaptive">
                            {calendar.name}
                          </p>
                          <p className="text-sm text-adaptive-muted">
                            {calendar.year} - Months {calendar.startMonth}-
                            {calendar.endMonth}
                          </p>
                          {ownerName && (
                            <p className="text-xs text-adaptive-muted">
                              Owner: {ownerName}
                            </p>
                          )}
                        </div>
                        {isSelected && !isDeleteMode && (
                          <Badge variant="primary">Selected</Badge>
                        )}
                      </div>
                    </button>
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
