# Testing Services Calendar Manager — React Build Spec

## Context

This is a "Calendar Manager" feature for a testing center system. Each employee owns their own set of calendars (like a personal planner, not one shared org calendar). A calendar covers a range of months in a given year, and within it, staff schedule closures, test-family events, employee work-schedule badges, and free-text notes onto individual days, scoped per testing-center location. There's a working vanilla-JS prototype of an earlier, simpler version of this in a sibling repo (see "Prototype reference" section below) — build this as a proper React version against the real DB, not a port of that code.

The database schema is already built. Do not re-derive it — implement against these tables exactly as named (camelCase, matches the rest of this repo's schema).

## Data model (already built — source of truth)

employees.badgeColor   varchar(20) unique   -- hex color, used to render this employee's badges/blocks

calendars
id, employeeId (owner, not null, FK employees), name, year,
rangeType ('janToMay' | 'juneJuly' | 'augToDec' | 'fullYear' | 'custom'),
startMonth (1-12), endMonth (1-12), createdAt

calendarMonths
id, calendarId (FK), year, month (1-12)
unique(calendarId, year, month)

holidays
id, name, month (1-12), day (1-31), year (nullable)
-- year IS NULL  -> recurring fixed-date holiday (e.g. July 4th), applies every year
-- year IS SET   -> one-off/floating holiday (e.g. Thanksgiving), re-entered yearly

calendarClosures
id, calendarId (FK), locationId (FK), date,
holidayId (nullable FK -- set if this closure came from the holiday-selection step),
reason, createdAt
unique(calendarId, locationId, date)

calendarDayLabels
id, calendarId (FK), locationId (FK), date, label,
showWhenClosed (boolean, default false),
createdAt
unique(calendarId, locationId, date)   -- one label per day per location

calendarTestFamilyBadges
id, calendarId (FK), locationId (FK), date, testFamilyId (FK),
startTime, endTime, createdAt
-- no uniqueness constraint -- multiple test families can run same day/location

calendarEmployeeBadges
id, calendarId (FK), locationId (FK), date, employeeId (FK),
startTime (nullable), endTime (nullable),
customLabel (nullable -- "OFF", "REQUESTED OFF", or free text, used INSTEAD of start/end),
createdAt
-- one row per work block; an employee can have multiple blocks on the same day (separate rows)
-- customLabel rows are excluded from hour totals

calendarDayNotes
id, calendarId (FK), locationId (FK), date, message,
createdAt, updatedAt, createdBy (FK employees), updatedBy (FK employees)
-- multiple notes allowed per day/location, no visibility flag (see behavior notes below)

These join against the pre-existing `employees`, `locations`, and `testFamilies` tables in this repo.

## Business rules / behavior to implement

**Ownership:** Every calendar list view is scoped to the logged-in employee (`calendars.employeeId`). There is no shared/org-wide calendar list — "My Calendars" is the only list.

**Creation flow (wizard, not a single form):**

1. Name the calendar, pick a range preset (Jan–May / June–July / Aug–Dec / Full Year / Custom range), pick a year. Custom lets the user pick arbitrary start/end months.
2. Show the holidays that fall within the resulting month range (query `holidays`, resolving `year IS NULL` recurring ones against the chosen year). Let the user check which holidays to close the center for. For each selected holiday, let them choose "apply to all locations" or hand-pick specific locations.
3. On save: create the `calendars` row, generate all `calendarMonths` rows for the range, and insert one `calendarClosures` row per (selected holiday × chosen location).

**Editing a day**, per location:

- Toggle **"Testing Center Closed"** — writes/removes a `calendarClosures` row. When closed for a given location, suppress all `calendarTestFamilyBadges` and `calendarEmployeeBadges` rendering for that day/location. The only exception: a `calendarDayLabels` row with `showWhenClosed = true` still renders on top of the closed badge.
- Add/edit the **one custom label** for that day/location (`calendarDayLabels`, with the show-when-closed toggle described above).
- Add a **test-family badge**: pick a `testFamily`, a start/end time, one or more locations, and optionally one or more other days in the same month to copy the exact same info to. This should fan out into multiple `calendarTestFamilyBadges` rows (one per location × day combination) — don't try to model this as a single row with arrays.
- Add an **employee badge**: pick an employee, a location, and either a start/end time block OR a custom label ("OFF", "REQUESTED OFF", or free text). Support adding multiple time blocks for the same employee/day (each is its own row) and a "copy to other days" picker, same fan-out pattern as test-family badges.
- Add **day notes**: free-text, multiple allowed per day/location, track `createdBy`/`updatedBy`.

**Viewing a calendar (month grid):**

- 7 weekday columns, optional 8th "Total Hours" column per week row — toggle on/off. When on, sum `calendarEmployeeBadges` time blocks for that week (only rows with `startTime`/`endTime` set; `customLabel` rows contribute 0).
- Independent, combinable filters: by `testFamily`, by `employee`, by `location`. Default is "show all" for each filter, not "show none."
- Notes are shown/hidden via a single view-wide switch (like the hours-column toggle) — **not** a per-note flag. There is no `isVisible`-style column on `calendarDayNotes`; this is pure client-side view state.
- Print button — produce a print-friendly rendering of the currently filtered month view.

**Validation to carry over:** when adding/editing an employee's time blocks for a day, apply a "5 consecutive hours without a break" rule — treat two blocks less than 60 minutes apart as one continuous stretch (not two isolated blocks) when checking the rule, and block/warn on save if violated.

## Directory structure

/src/pages/
CalendarCreatorPage.jsx   -- thin route wrapper, renders the creation wizard
CalendarEditorPage.jsx    -- thin route wrapper, renders calendar selection + view/edit

/src/components/calendar/
pages/         -- larger composed views (this is where most real logic lives)
components/    -- small reusable presentational pieces
utils/         -- pure logic, no JSX

Suggested breakdown (adjust freely to fit this repo's existing conventions — check how other features in this repo split pages vs. components first):

**`/src/components/calendar/pages/`**

- `CalendarList.jsx` — the logged-in employee's calendars + "create new" entry point
- `CalendarCreatorWizard.jsx` — the 3-step creation flow described above (or split into per-step components if that matches this repo's form patterns)
- `CalendarMonthView.jsx` — the read/filter/print grid
- `CalendarDayEditor.jsx` — the day detail edit panel

**`/src/components/calendar/components/`**

- `MonthGrid.jsx`, `WeekRow.jsx`, `DayCell.jsx`
- `ClosedBadge.jsx`, `DayLabelBadge.jsx`, `TestFamilyBadge.jsx`, `EmployeeBadge.jsx`
- `FilterBar.jsx` (testFamily/employee/location filters + hours-column toggle + notes toggle)
- `RangePresetPicker.jsx`, `YearPicker.jsx`
- `HolidayClosureStep.jsx` (holiday checklist + per-holiday location picker)
- `TestFamilyBadgeForm.jsx`, `EmployeeBadgeForm.jsx` (both need a multi-location + multi-day "copy to" picker)
- `DayNotesPanel.jsx`
- `PrintableCalendar.jsx`

**`/src/components/calendar/utils/`**

- `dateGrid.js` — build a month's week/day grid structure
- `rangePresets.js` — map `rangeType` → `{startMonth, endMonth}`, generate the `calendarMonths` set for a year+range
- `scheduleValidation.js` — the break-rule validation described above
- `hoursSum.js` — sum a week's employee time blocks for the 8th column, excluding `customLabel` rows

## Data/API layer

This needs a real backend now (not localStorage). Add a service module under this feature (naming/location to match however this repo already talks to its API — check for an existing pattern before inventing one) with functions mapped 1:1 to the tables above: list/create calendars scoped to the current employee, list calendar months, list holidays for a range, list/add/remove closures, get/upsert a day's label, list/add/delete test-family badges, list/add/delete employee badges, list/add/update/delete day notes. Filter parameters should mirror the View Calendar filters (month, location, testFamily, employee).

## Prototype reference (UX/logic only — do not port the code)

A simpler, single-location, localStorage-backed version of this already exists and works in the sibling `testing-services-design-lab` repo, useful for UX and logic reference:

- `js/pages/slate/calendar/ViewCalendarView.js` and `EditCalendarView.js` — grid layout, filter UX, day-detail editing flow
- `js/utils/calendarDates.js` — includes the break-rule validation logic to reference
- Its print flow (hidden div populated on click, shown via a body class + `@media print` CSS, to dodge popup blockers) is a reusable pattern

That prototype has **no** concept of: multiple locations, per-employee calendar ownership, a creation wizard with range presets, holiday-driven closures, or day notes — those are all new for this build, not things to port over.
That's the whole spec in one pasteable block.