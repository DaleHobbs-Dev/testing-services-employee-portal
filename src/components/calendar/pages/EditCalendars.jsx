import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Alert,
  Container,
  DeleteConfirmationModal,
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
  deleteCalendar,
  createCalendarClosure,
  deleteCalendarClosure,
  upsertCalendarDayLabel,
  deleteCalendarDayLabel,
  createCalendarTestFamilyBadge,
  createCalendarEmployeeBadge,
  createCalendarDayNote,
  getAllEmployees,
  getEmployeeDirectory,
  getAllLocations,
  getAllTestFamilies,
} from "@/services";
import { employeeHasRole } from "@/utils/roleUtils";
import { CalendarSelector } from "@/components/calendar/components/CalendarSelector";
import { CalendarFilterBar } from "@/components/calendar/components/CalendarFilterBar";
import { CalendarMonthGrid } from "@/components/calendar/components/CalendarMonthGrid";
import { CalendarDayEditor } from "@/components/calendar/components/CalendarDayEditor";
import { getMonthName } from "@/components/calendar/utils/dateGrid";

const normalizeList = (response, key) => {
  if (Array.isArray(response)) return response;
  return response?.[key] || response?.items || [];
};

const buildMonthOptions = (calendar) => {
  if (!calendar) return [];

  const startMonth = Number(calendar.startMonth);
  const endMonth = Number(calendar.endMonth);
  const months = [];

  for (let month = startMonth; month <= endMonth; month += 1) {
    months.push(month);
  }

  return months;
};

export function EditCalendars() {
  const location = useLocation();
  const { currentUser } = useCurrentUser();
  const canManageAllCalendars = employeeHasRole(currentUser, ["admin", "clerk"]);
  const canUseFullEmployeeList = employeeHasRole(currentUser, [
    "admin",
    "technician",
  ]);
  const initialCalendarId = location.state?.calendarId;
  const initialStartMonth = location.state?.startMonth;

  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthView, setMonthView] = useState({});
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [testFamilies, setTestFamilies] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filters, setFilters] = useState({
    locationId: "",
    testFamilyId: "",
    employeeId: "",
    showLabels: true,
    showNotes: true,
    showHoursColumn: false,
    showMySchedule: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMonthLoading, setIsMonthLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingCalendars, setIsDeletingCalendars] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [markedCalendarIds, setMarkedCalendarIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  }, [filters.employeeId, filters.locationId, filters.testFamilyId, selectedCalendar, selectedMonth]);

  useEffect(() => {
    Promise.all([
      canManageAllCalendars ? getAllCalendars() : getMyCalendars(),
      getAllLocations(),
      canUseFullEmployeeList ? getAllEmployees() : getEmployeeDirectory(),
      getAllTestFamilies(),
    ])
      .then(([calendarData, locationData, employeeData, testFamilyData]) => {
        const nextCalendars = normalizeList(calendarData, "calendars");
        const nextLocations = normalizeList(locationData, "locations");

        setCalendars(nextCalendars);
        setLocations(nextLocations);
        setEmployees(normalizeList(employeeData, "employees"));
        setTestFamilies(normalizeList(testFamilyData, "testFamilies"));

        if (nextLocations.length > 0) {
          setFilters((prev) => ({
            ...prev,
            locationId: prev.locationId || String(nextLocations[0].id),
          }));
        }

        if (nextCalendars.length > 0) {
          const initialCalendar =
            nextCalendars.find(
              (calendar) => String(calendar.id) === String(initialCalendarId)
            ) || nextCalendars[0];

          setSelectedCalendar(initialCalendar);
          setSelectedMonth(
            String(initialStartMonth || initialCalendar.startMonth)
          );
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load calendar management data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    canManageAllCalendars,
    canUseFullEmployeeList,
    initialCalendarId,
    initialStartMonth,
  ]);

  useEffect(() => {
    loadMonthView();
  }, [loadMonthView]);

  const handleSelectCalendar = (calendar) => {
    setSelectedCalendar(calendar);
    setSelectedMonth(String(calendar.startMonth));
    setSelectedDate("");
    setSuccess("");
  };

  const handleToggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
    setMarkedCalendarIds([]);
  };

  const handleToggleMarkedCalendar = (calendarId) => {
    setMarkedCalendarIds((prev) =>
      prev.map(String).includes(String(calendarId))
        ? prev.filter((id) => String(id) !== String(calendarId))
        : [...prev, calendarId]
    );
  };

  const handleConfirmDeleteCalendars = async () => {
    setIsDeletingCalendars(true);
    setError("");
    setSuccess("");

    try {
      await Promise.all(markedCalendarIds.map((id) => deleteCalendar(id)));

      const deletedIdStrings = markedCalendarIds.map(String);
      const nextCalendars = calendars.filter(
        (calendar) => !deletedIdStrings.includes(String(calendar.id))
      );

      setCalendars(nextCalendars);
      setMarkedCalendarIds([]);
      setIsDeleteMode(false);
      setIsDeleteModalOpen(false);
      setSuccess("Deleted marked calendars.");

      if (
        selectedCalendar &&
        deletedIdStrings.includes(String(selectedCalendar.id))
      ) {
        const nextSelectedCalendar = nextCalendars[0] || null;

        setSelectedCalendar(nextSelectedCalendar);
        setSelectedMonth(
          nextSelectedCalendar ? String(nextSelectedCalendar.startMonth) : ""
        );
        setSelectedDate("");
        setMonthView({});
      }
    } catch (err) {
      console.error(err);
      setError("Could not delete the marked calendars.");
    } finally {
      setIsDeletingCalendars(false);
    }
  };

  const handleSaveDay = async (dayData) => {
    if (!selectedCalendar) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (dayData.isClosed && !dayData.existingClosure) {
        await createCalendarClosure(selectedCalendar.id, {
          locationId: dayData.locationId,
          date: dayData.date,
          reason: dayData.closureReason,
        });
      }

      if (!dayData.isClosed && dayData.existingClosure) {
        await deleteCalendarClosure(
          selectedCalendar.id,
          dayData.existingClosure.id
        );
      }

      if (dayData.label) {
        await upsertCalendarDayLabel(
          selectedCalendar.id,
          dayData.date,
          dayData.locationId,
          {
            label: dayData.label,
            showWhenClosed: dayData.showWhenClosed,
          }
        );
      } else if (dayData.existingLabel) {
        await deleteCalendarDayLabel(
          selectedCalendar.id,
          dayData.date,
          dayData.locationId
        );
      }

      if (dayData.testFamilyBadge) {
        await createCalendarTestFamilyBadge(
          selectedCalendar.id,
          dayData.testFamilyBadge
        );
      }

      if (dayData.employeeBadge) {
        await createCalendarEmployeeBadge(
          selectedCalendar.id,
          dayData.employeeBadge
        );
      }

      if (dayData.note) {
        await createCalendarDayNote(selectedCalendar.id, dayData.note);
      }

      setSuccess(`Saved changes for ${dayData.date}.`);
      await loadMonthView();
    } catch (err) {
      console.error(err);
      setError("Could not save this calendar day.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <Container wide>
      <Section className="max-w-7xl 2xl:max-w-[96rem] mx-auto">
        <PageHeader
          title="Edit Calendars"
          description="Choose a calendar, select a month, and save updates to individual days."
          center
        />

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <CalendarSelector
            calendars={calendars}
            selectedCalendarId={selectedCalendar?.id}
            onSelect={handleSelectCalendar}
            title={canManageAllCalendars ? "All Calendars" : "My Calendars"}
            emptyMessage="No calendars are available yet."
            allowDelete
            isDeleteMode={isDeleteMode}
            markedCalendarIds={markedCalendarIds}
            onToggleDeleteMode={handleToggleDeleteMode}
            onToggleMarkedCalendar={handleToggleMarkedCalendar}
            onDeleteMarkedCalendars={() => setIsDeleteModalOpen(true)}
            isDeleting={isDeletingCalendars}
          />

          <div className="space-y-6">
            {selectedCalendar ? (
              <>
                <div className="rounded-xl border border-adaptive bg-muted p-4">
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-adaptive">
                        Choose a Month
                      </h3>
                      <FormField label="Month">
                        <Select
                          value={selectedMonth}
                          onChange={(event) => {
                            setSelectedMonth(event.target.value);
                            setSelectedDate("");
                          }}
                        >
                          {monthOptions.map((month) => (
                            <option key={month} value={month}>
                              {getMonthName(month)}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                    </div>

                    <div className="lg:border-l lg:border-adaptive lg:pl-5">
                      <h3 className="mb-3 text-sm font-semibold text-adaptive">
                        Additional Filters
                      </h3>
                      <CalendarFilterBar
                        filters={filters}
                        onChange={setFilters}
                        locations={locations}
                        testFamilies={testFamilies}
                        employees={employees}
                        showEmployeeFilter
                        showMyScheduleToggle
                        showToggles={false}
                        filterClassName="grid grid-cols-1 md:grid-cols-3 gap-4"
                      />
                    </div>
                  </div>

                  <CalendarFilterBar
                    filters={filters}
                    onChange={setFilters}
                    locations={locations}
                    testFamilies={testFamilies}
                    employees={employees}
                    showEmployeeFilter
                    showMyScheduleToggle
                    showFilters={false}
                    toggleClassName="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-adaptive pt-4"
                  />
                </div>

                {isMonthLoading ? (
                  <div className="text-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 2xl:grid-cols-[1fr_420px] gap-6">
                    <CalendarMonthGrid
                      year={Number(selectedCalendar.year)}
                      month={Number(selectedMonth)}
                      monthView={hydratedMonthView}
                      filters={filters}
                      currentUser={currentUser}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      editable
                    />
                    <CalendarDayEditor
                      key={`${selectedDate}-${filters.locationId}`}
                      date={selectedDate}
                      locationId={filters.locationId}
                      monthView={hydratedMonthView}
                      locations={locations}
                      employees={employees}
                      testFamilies={testFamilies}
                      onSave={handleSaveDay}
                      isSaving={isSaving}
                    />
                  </div>
                )}
              </>
            ) : (
              <Alert variant="info">
                Create a calendar before using the calendar editor.
              </Alert>
            )}
          </div>
        </div>
      </Section>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteCalendars}
        title="Delete Calendars"
        message="Are you sure you want to delete these calendars? This action cannot be undone."
        warning={null}
        isDeleting={isDeletingCalendars}
      />
    </Container>
  );
}
