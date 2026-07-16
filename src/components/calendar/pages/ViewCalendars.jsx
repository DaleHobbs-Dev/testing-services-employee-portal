import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Container,
  FormField,
  PageHeader,
  Section,
  Select,
  Spinner,
} from "@/components";
import { useCurrentUser } from "@/context";
import {
  getAllCalendars,
  getCalendarMonthView,
  getMyCalendars,
  getAllEmployees,
  getAllLocations,
  getAllTestFamilies,
} from "@/services";
import { employeeHasRole } from "@/utils/roleUtils";
import { CalendarSelector } from "@/components/calendar/components/CalendarSelector";
import { CalendarFilterBar } from "@/components/calendar/components/CalendarFilterBar";
import { CalendarMonthGrid } from "@/components/calendar/components/CalendarMonthGrid";
import { getMonthName } from "@/components/calendar/utils/dateGrid";

const normalizeList = (response, key) => {
  if (Array.isArray(response)) return response;
  return response?.[key] || response?.items || [];
};

const buildMonthOptions = (calendar) => {
  if (!calendar) return [];

  const months = [];
  for (
    let month = Number(calendar.startMonth);
    month <= Number(calendar.endMonth);
    month += 1
  ) {
    months.push(month);
  }

  return months;
};

export function ViewCalendars() {
  const { currentUser } = useCurrentUser();
  const canViewAllCalendars = employeeHasRole(currentUser, ["admin", "clerk"]);

  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthView, setMonthView] = useState({});
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [testFamilies, setTestFamilies] = useState([]);
  const [filters, setFilters] = useState({
    locationId: "",
    testFamilyId: "",
    employeeId: "",
    showLabels: true,
    showNotes: false,
    showHoursColumn: false,
    showMySchedule: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMonthLoading, setIsMonthLoading] = useState(false);
  const [error, setError] = useState("");

  const monthOptions = useMemo(
    () => buildMonthOptions(selectedCalendar),
    [selectedCalendar]
  );

  const hydratedMonthView = useMemo(
    () => ({
      ...monthView,
      locations: monthView.locations || locations,
      employees: monthView.employees || employees,
      testFamilies: monthView.testFamilies || testFamilies,
      closures: monthView.closures || [],
      labels: monthView.labels || [],
      testFamilyBadges: monthView.testFamilyBadges || [],
      employeeBadges: monthView.employeeBadges || [],
      notes: monthView.notes || [],
    }),
    [employees, locations, monthView, testFamilies]
  );

  const loadMonthView = useCallback(async () => {
    if (!selectedCalendar || !selectedMonth) return;

    setIsMonthLoading(true);
    setError("");

    try {
      const data = await getCalendarMonthView(selectedCalendar.id, {
        year: selectedCalendar.year,
        month: selectedMonth,
        locationId: filters.locationId,
        testFamilyId: filters.testFamilyId,
        employeeId: filters.employeeId,
      });
      setMonthView(data);
    } catch (err) {
      console.error(err);
      setError("Could not load this calendar month.");
      setMonthView({});
    } finally {
      setIsMonthLoading(false);
    }
  }, [
    filters.employeeId,
    filters.locationId,
    filters.testFamilyId,
    selectedCalendar,
    selectedMonth,
  ]);

  useEffect(() => {
    Promise.all([
      canViewAllCalendars ? getAllCalendars() : getMyCalendars(),
      getAllLocations(),
      getAllEmployees(),
      getAllTestFamilies(),
    ])
      .then(([calendarData, locationData, employeeData, testFamilyData]) => {
        const nextCalendars = normalizeList(calendarData, "calendars");

        setCalendars(nextCalendars);
        setLocations(normalizeList(locationData, "locations"));
        setEmployees(normalizeList(employeeData, "employees"));
        setTestFamilies(normalizeList(testFamilyData, "testFamilies"));

        if (nextCalendars.length > 0) {
          const firstCalendar = nextCalendars[0];
          setSelectedCalendar(firstCalendar);
          setSelectedMonth(String(firstCalendar.startMonth));
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load calendar viewer data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [canViewAllCalendars]);

  useEffect(() => {
    loadMonthView();
  }, [loadMonthView]);

  const handleSelectCalendar = (calendar) => {
    setSelectedCalendar(calendar);
    setSelectedMonth(String(calendar.startMonth));
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <Container>
      <Section className="max-w-7xl mx-auto">
        <PageHeader
          title="View Calendars"
          description="Review calendar months with filters for labels, hours, notes, schedules, and test families."
          center
        />

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <CalendarSelector
            calendars={calendars}
            selectedCalendarId={selectedCalendar?.id}
            onSelect={handleSelectCalendar}
            title={canViewAllCalendars ? "All Calendars" : "My Calendars"}
            emptyMessage="No calendars are available yet."
          />

          <div className="space-y-6">
            {selectedCalendar ? (
              <>
                <div className="rounded-xl border border-adaptive bg-muted p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Month">
                      <Select
                        value={selectedMonth}
                        onChange={(event) =>
                          setSelectedMonth(event.target.value)
                        }
                      >
                        {monthOptions.map((month) => (
                          <option key={month} value={month}>
                            {getMonthName(month)}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  </div>

                  <CalendarFilterBar
                    filters={filters}
                    onChange={setFilters}
                    locations={locations}
                    testFamilies={testFamilies}
                    employees={employees}
                    showEmployeeFilter
                    showMyScheduleToggle
                  />
                </div>

                {isMonthLoading ? (
                  <div className="text-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <CalendarMonthGrid
                    year={Number(selectedCalendar.year)}
                    month={Number(selectedMonth)}
                    monthView={hydratedMonthView}
                    filters={filters}
                    currentUser={currentUser}
                    selectedDate=""
                    onSelectDate={() => {}}
                  />
                )}
              </>
            ) : (
              <Alert variant="info">
                Create a calendar before using the calendar viewer.
              </Alert>
            )}
          </div>
        </div>
      </Section>
    </Container>
  );
}
