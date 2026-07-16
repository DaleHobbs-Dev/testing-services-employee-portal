import { Badge, Button, Card } from "@/components";
import {
  buildMonthGrid,
  getMonthName,
  WEEKDAY_LABELS,
} from "@/components/calendar/utils/dateGrid";
import { sumEmployeeBadgeHours } from "@/components/calendar/utils/hoursSum";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";

const asString = (value) => (value === undefined || value === null ? "" : String(value));

const getItemsByDate = (items = [], date) =>
  items.filter((item) => item.date === date);

const filterByLocation = (items = [], locationId) =>
  locationId
    ? items.filter((item) => asString(item.locationId) === asString(locationId))
    : items;

const filterBadges = (items = [], filters, key) =>
  items.filter((item) => {
    if (
      filters.locationId &&
      asString(item.locationId) !== asString(filters.locationId)
    ) {
      return false;
    }

    if (filters[key] && asString(item[key]) !== asString(filters[key])) {
      return false;
    }

    return true;
  });

const getTestFamilyName = (badge, testFamilies) => {
  const testFamily = testFamilies.find(
    (item) => asString(item.id) === asString(badge.testFamilyId)
  );

  return testFamily?.name || testFamily?.label || "Test Family";
};

const getEmployeeName = (badge, employees) => {
  const employee = employees.find(
    (item) => asString(item.id) === asString(badge.employeeId)
  );

  return getEmployeeDisplayName(employee);
};

export function CalendarMonthGrid({
  year,
  month,
  monthView = {},
  filters,
  currentUser,
  selectedDate,
  onSelectDate,
  editable = false,
}) {
  const weeks = buildMonthGrid(year, month);
  const closures = monthView.closures || [];
  const labels = monthView.labels || [];
  const testFamilyBadges = monthView.testFamilyBadges || [];
  const employeeBadges = monthView.employeeBadges || [];
  const notes = monthView.notes || [];
  const employees = monthView.employees || [];
  const testFamilies = monthView.testFamilies || [];

  const getDayData = (date) => {
    const dayClosures = filterByLocation(getItemsByDate(closures, date), filters.locationId);
    const isClosed = dayClosures.length > 0;
    const shouldSuppressBadges = !!filters.locationId && isClosed;
    const dayLabels = filterByLocation(getItemsByDate(labels, date), filters.locationId);
    const dayTestFamilyBadges = filterBadges(
      getItemsByDate(testFamilyBadges, date),
      filters,
      "testFamilyId"
    );
    const dayEmployeeBadges = filterBadges(
      getItemsByDate(employeeBadges, date),
      filters,
      "employeeId"
    ).filter((badge) => {
      if (filters.showMySchedule !== false) return true;
      return asString(badge.employeeId) !== asString(currentUser?.id);
    });

    return {
      dayClosures,
      dayLabels,
      dayTestFamilyBadges: shouldSuppressBadges ? [] : dayTestFamilyBadges,
      dayEmployeeBadges: shouldSuppressBadges ? [] : dayEmployeeBadges,
      dayNotes: filterByLocation(getItemsByDate(notes, date), filters.locationId),
      isClosed,
      shouldSuppressBadges,
    };
  };

  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-primary-dark">
          {getMonthName(month)} {year}
        </h2>
      </div>

      <div
        className={`grid ${
          filters.showHoursColumn ? "grid-cols-8" : "grid-cols-7"
        } text-sm`}
      >
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="border border-adaptive bg-primary-light/20 p-2 font-semibold text-primary-dark"
          >
            {day}
          </div>
        ))}
        {filters.showHoursColumn && (
          <div className="border border-adaptive bg-primary-light/20 p-2 font-semibold text-primary-dark">
            Total Hours
          </div>
        )}

        {weeks.map((week, weekIndex) => {
          const weekDates = week.map((day) => day.date).filter(Boolean);
          const weekHours = sumEmployeeBadgeHours(
            filterBadges(
              employeeBadges.filter((badge) => weekDates.includes(badge.date)),
              filters,
              "employeeId"
            ).filter((badge) => {
              if (filters.showMySchedule !== false) return true;
              return asString(badge.employeeId) !== asString(currentUser?.id);
            })
          );

          return (
            <div
              key={`week-${weekIndex}`}
              className={`contents`}
            >
              {week.map((day) => {
                const dayData = day.date ? getDayData(day.date) : null;
                const isSelected = day.date && day.date === selectedDate;

                return (
                  <button
                    key={day.key}
                    type="button"
                    disabled={!day.isCurrentMonth}
                    onClick={() => day.date && onSelectDate(day.date)}
                    className={`
                      min-h-36 border border-adaptive p-2 text-left align-top transition
                      ${day.isCurrentMonth ? "bg-adaptive hover:bg-primary-light/10" : "bg-gray-100"}
                      ${isSelected ? "ring-2 ring-primary" : ""}
                    `}
                  >
                    {day.isCurrentMonth && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-adaptive">
                            {day.dayNumber}
                          </span>
                          {editable && <Badge size="sm">Edit</Badge>}
                        </div>

                        {dayData.isClosed && (
                          <Badge variant="danger" size="sm">
                            Closed
                          </Badge>
                        )}

                        {filters.showLabels &&
                          dayData.dayLabels
                            .filter(
                              (label) =>
                                !dayData.shouldSuppressBadges ||
                                label.showWhenClosed
                            )
                            .map((label) => (
                              <Badge key={label.id || label.date} variant="primary" size="sm">
                                {label.label}
                              </Badge>
                            ))}

                        {dayData.dayTestFamilyBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                          >
                            {getTestFamilyName(badge, testFamilies)}{" "}
                            {badge.startTime}-{badge.endTime}
                          </div>
                        ))}

                        {dayData.dayEmployeeBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="rounded px-2 py-1 text-xs text-gray-900"
                            style={{
                              backgroundColor:
                                employees.find(
                                  (item) =>
                                    asString(item.id) ===
                                    asString(badge.employeeId)
                                )?.badgeColor || "#E5E7EB",
                            }}
                          >
                            {getEmployeeName(badge, employees)}{" "}
                            {badge.customLabel ||
                              `${badge.startTime}-${badge.endTime}`}
                          </div>
                        ))}

                        {filters.showNotes &&
                          dayData.dayNotes.map((note) => (
                            <div
                              key={note.id}
                              className="rounded bg-yellow-50 px-2 py-1 text-xs text-yellow-800"
                            >
                              {note.message}
                            </div>
                          ))}
                      </div>
                    )}
                  </button>
                );
              })}

              {filters.showHoursColumn && (
                <div className="min-h-36 border border-adaptive bg-muted p-3 text-sm font-semibold text-adaptive">
                  {weekHours.toFixed(1)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!editable && (
        <div className="mt-4 flex justify-end">
          <Button onClick={() => window.print()} variant="secondary">
            Print View
          </Button>
        </div>
      )}
    </Card>
  );
}
