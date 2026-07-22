import { Badge, Button, Card } from "@/components";
import {
  buildMonthGrid,
  getMonthName,
  WEEKDAY_LABELS,
} from "@/components/calendar/utils/dateGrid";
import { getBadgeHours } from "@/components/calendar/utils/hoursSum";
import { DEFAULT_DAY_NOTE_COLOR } from "@/components/calendar/components/DayNoteColorPicker";
import {
  CLOSURE_TYPES,
  DEFAULT_CLOSURE_TYPE,
} from "@/components/calendar/utils/closureTypes";
import { getReadableTextColor } from "@/components/calendar/utils/colorContrast";
import { NONE_FILTER_VALUE } from "@/components/calendar/utils/filterValues";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";
import { formatOptionalTimeRange } from "@/components/calendar/utils/timeRange";

const asString = (value) => (value === undefined || value === null ? "" : String(value));

const getItemsByDate = (items = [], date) =>
  items.filter((item) => item.date === date);

const GRID_COLUMN_CLASSES = {
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
};

const getVisibleWeekdays = (filters) =>
  WEEKDAY_LABELS.map((label, index) => ({ label, index })).filter((weekday) => {
    if (weekday.index === 0) return filters.showSunday === true;
    if (weekday.index === 6) return filters.showSaturday === true;
    return true;
  });

const filterByLocation = (items = [], locationId) =>
  locationId
    ? items.filter((item) => asString(item.locationId) === asString(locationId))
    : items;

const normalizeClosureType = (closureType) =>
  closureType || DEFAULT_CLOSURE_TYPE;

const filterClosures = (items = [], filters) => {
  const selectedClosureTypes =
    filters.closureTypes || CLOSURE_TYPES.map((closureType) => closureType.value);

  return filterByLocation(items, filters.locationId).filter((closure) =>
    selectedClosureTypes.includes(normalizeClosureType(closure.closureType))
  );
};

const filterBadges = (items = [], filters, key) =>
  items.filter((item) => {
    if (filters[key] === NONE_FILTER_VALUE) {
      return false;
    }

    if (Array.isArray(filters[key]) && filters[key].length > 0) {
      return filters[key].map(String).includes(asString(item[key]));
    }

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

const getNoteColor = (note) =>
  note?.colorHex || note?.color || DEFAULT_DAY_NOTE_COLOR;

const getBadgeStyle = (backgroundColor) => ({
  backgroundColor,
  color: getReadableTextColor(backgroundColor),
});

const getTestFamilyName = (badge, testFamilies) => {
  if (badge.testFamily?.name) return badge.testFamily.name;

  const testFamily = testFamilies.find(
    (item) => asString(item.id) === asString(badge.testFamilyId)
  );

  return testFamily?.name || testFamily?.label || "Test Type";
};

const getTestFamilyColor = (badge, testFamilies) => {
  const testFamily = testFamilies.find(
    (item) => asString(item.id) === asString(badge.testFamilyId)
  );

  return badge.testFamily?.badgeColor || testFamily?.badgeColor || "#DBEAFE";
};

const getEmployeeName = (badge, employees) => {
  if (badge.employee) return getEmployeeDisplayName(badge.employee);

  const employee = employees.find(
    (item) => asString(item.id) === asString(badge.employeeId)
  );

  return getEmployeeDisplayName(employee);
};

const getEmployeeBadgeColor = (badge, employees) => {
  const employee = employees.find(
    (item) => asString(item.id) === asString(badge.employeeId)
  );

  return badge.employee?.badgeColor || employee?.badgeColor || "#E5E7EB";
};

const getEmployeeHoursSummary = (badges = [], employees = []) => {
  const summariesByEmployee = new Map();

  badges.forEach((badge) => {
    const hours = getBadgeHours(badge);
    if (hours <= 0) return;

    const employeeKey = asString(badge.employeeId || badge.employee?.id);
    if (!employeeKey) return;

    const currentSummary = summariesByEmployee.get(employeeKey) || {
      employeeKey,
      name: getEmployeeName(badge, employees),
      color: getEmployeeBadgeColor(badge, employees),
      hours: 0,
    };

    summariesByEmployee.set(employeeKey, {
      ...currentSummary,
      hours: currentSummary.hours + hours,
    });
  });

  return Array.from(summariesByEmployee.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
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
  const visibleWeekdays = getVisibleWeekdays(filters);
  const visibleWeekdayIndexes = visibleWeekdays.map((weekday) => weekday.index);
  const columnCount =
    visibleWeekdays.length + (filters.showHoursColumn ? 1 : 0);
  const closures = monthView.closures || [];
  const labels = monthView.labels || [];
  const testFamilyBadges = monthView.testFamilyBadges || [];
  const employeeBadges = monthView.employeeBadges || [];
  const notes = monthView.notes || [];
  const employees = monthView.employees || [];
  const testFamilies = monthView.testFamilies || [];

  const getDayData = (date) => {
    const dayClosures = filterClosures(getItemsByDate(closures, date), filters);
    const isClosed = dayClosures.length > 0;
    const shouldSuppressBadges = !!filters.locationId && isClosed;
    const dayLabels = filterByLocation(getItemsByDate(labels, date), filters.locationId);
    const hoverLabels = dayLabels
      .map((label) => label.label)
      .filter(Boolean);
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
      hoverLabels,
      dayTestFamilyBadges: shouldSuppressBadges ? [] : dayTestFamilyBadges,
      dayEmployeeBadges: shouldSuppressBadges ? [] : dayEmployeeBadges,
      dayNotes: filterByLocation(getItemsByDate(notes, date), filters.locationId),
      isClosed,
      shouldSuppressBadges,
    };
  };

  return (
    <Card className="calendar-print-area overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-primary-dark">
            {getMonthName(month)} {year}
          </h2>
          {editable && (
            <p className="calendar-print-helper mt-1 text-sm text-adaptive-muted">
              Select a day by clicking the appropriate day on the calendar to
              edit the day.
            </p>
          )}
        </div>
      </div>

      <div
        className={`calendar-print-grid grid ${GRID_COLUMN_CLASSES[columnCount]} text-sm`}
      >
        {visibleWeekdays.map((day) => (
          <div
            key={day.label}
            className="border border-adaptive bg-primary-light/20 p-2 font-semibold text-primary-dark dark:bg-primary-light/30 dark:text-primary-light"
          >
            {day.label}
          </div>
        ))}
        {filters.showHoursColumn && (
          <div className="border border-adaptive bg-primary-light/20 p-2 font-semibold text-primary-dark dark:bg-primary-light/30 dark:text-primary-light">
            Hours
          </div>
        )}

        {weeks.map((week, weekIndex) => {
          const visibleWeek = week.filter((day, index) =>
            visibleWeekdayIndexes.includes(index)
          );
          const weekDates = visibleWeek.map((day) => day.date).filter(Boolean);
          const weekEmployeeBadges =
            filterBadges(
              employeeBadges.filter((badge) => weekDates.includes(badge.date)),
              filters,
              "employeeId"
            ).filter((badge) => {
              if (filters.showMySchedule !== false) return true;
              return asString(badge.employeeId) !== asString(currentUser?.id);
            });
          const weekEmployeeHours = getEmployeeHoursSummary(
            weekEmployeeBadges,
            employees
          );

          return (
            <div
              key={`week-${weekIndex}`}
              className={`contents`}
            >
              {visibleWeek.map((day) => {
                const dayData = day.date ? getDayData(day.date) : null;
                const isSelected = day.date && day.date === selectedDate;

                return (
                  <button
                    key={day.key}
                    type="button"
                    disabled={!day.isCurrentMonth}
                    onClick={() => day.date && onSelectDate(day.date)}
                    className={`
                      calendar-print-day min-h-36 border border-adaptive p-2 text-left align-top transition
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
                        </div>

                        {dayData.isClosed && (
                          <span className="group relative inline-flex">
                            <Badge
                              variant="danger"
                              size="sm"
                              className="calendar-print-badge text-md font-semibold"
                            >
                              Closed
                            </Badge>
                            {dayData.hoverLabels.length > 0 && (
                              <span className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden min-w-36 max-w-52 rounded-md border border-adaptive bg-muted px-3 py-2 text-xs font-medium text-adaptive shadow-lg group-hover:block">
                                {dayData.hoverLabels.map((label) => (
                                  <span key={label} className="block">
                                    {label}
                                  </span>
                                ))}
                              </span>
                            )}
                          </span>
                        )}

                        {filters.showLabels &&
                          dayData.dayLabels
                            .filter(
                              (label) =>
                                !dayData.shouldSuppressBadges ||
                                label.showWhenClosed
                            )
                            .map((label) => (
                              <Badge
                                key={label.id || label.date}
                                variant="primary"
                                size="sm"
                                className="calendar-print-badge text-md font-semibold"
                              >
                                {label.label}
                              </Badge>
                            ))}

                        {dayData.dayTestFamilyBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="calendar-print-badge rounded px-2 py-1 text-md font-semibold"
                            style={getBadgeStyle(
                              getTestFamilyColor(badge, testFamilies)
                            )}
                          >
                            {getTestFamilyName(badge, testFamilies)}{" "}
                            {formatOptionalTimeRange(
                              badge.startTime,
                              badge.endTime
                            )}
                          </div>
                        ))}

                        {dayData.dayEmployeeBadges.map((badge) => (
                          <div
                            key={badge.id}
                            className="calendar-print-badge rounded px-2 py-1 text-md font-semibold"
                            style={getBadgeStyle(
                              getEmployeeBadgeColor(badge, employees)
                            )}
                          >
                            {getEmployeeName(badge, employees)}{" "}
                            {badge.customLabel ||
                              formatOptionalTimeRange(
                                badge.startTime,
                                badge.endTime
                              )}
                          </div>
                        ))}

                        {filters.showNotes &&
                          dayData.dayNotes.map((note) => (
                            <div
                              key={note.id}
                              className="calendar-print-badge rounded px-2 py-1 text-md font-semibold"
                              style={getBadgeStyle(getNoteColor(note))}
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
                <div className="calendar-print-hours-cell min-h-36 border border-adaptive bg-muted p-2 text-sm font-semibold text-adaptive">
                  <div className="flex flex-col gap-2">
                    {weekEmployeeHours.length === 0 ? (
                      <span className="text-xs font-medium text-adaptive-muted">
                        No hours
                      </span>
                    ) : (
                      weekEmployeeHours.map((summary) => (
                        <div
                          key={summary.employeeKey}
                          className="calendar-print-badge rounded px-2 py-1 text-md font-semibold"
                          style={getBadgeStyle(summary.color)}
                        >
                          {summary.name} {summary.hours.toFixed(1)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!editable && (
        <div className="calendar-print-controls mt-4 flex justify-end">
          <Button onClick={() => window.print()} variant="secondary">
            Print View
          </Button>
        </div>
      )}
    </Card>
  );
}
