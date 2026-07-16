import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components";

const getOwnerName = (calendar) =>
  calendar.employee?.name || calendar.owner?.name || calendar.employeeName;

export function CalendarSelector({
  calendars = [],
  selectedCalendarId,
  onSelect,
  title = "Calendars",
  emptyMessage = "No calendars found.",
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {calendars.length === 0 ? (
          <p className="text-sm text-adaptive-muted">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {calendars.map((calendar) => {
              const isSelected = String(calendar.id) === String(selectedCalendarId);
              const ownerName = getOwnerName(calendar);

              return (
                <button
                  key={calendar.id}
                  type="button"
                  onClick={() => onSelect(calendar)}
                  className={`
                    w-full rounded-lg border p-4 text-left transition
                    ${
                      isSelected
                        ? "border-primary bg-primary-light/20"
                        : "border-adaptive hover:border-primary"
                    }
                  `}
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
                    {isSelected && <Badge variant="primary">Selected</Badge>}
                  </div>
                </button>
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
