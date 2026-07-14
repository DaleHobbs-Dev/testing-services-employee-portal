import { useMemo, useState } from "react";
import {
  Container,
  Section,
  PageHeader,
  Spinner,
  Alert,
  AppointmentDatePicker,
  AppointmentTableGroup,
  ExamineeFilter,
  EmployeeFilter,
} from "@/components";
import { useCurrentUser } from "@/context";
import { useAppointmentData, useAppointmentFilters } from "@/hooks";
import { employeeHasRole, getEmployeeRoles } from "@/utils/roleUtils";

export function ProctoringDashboard() {
  const { currentUser } = useCurrentUser();
  const currentUserRoles = useMemo(
    () => getEmployeeRoles(currentUser),
    [currentUser]
  );

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Custom hook to fetch appointment data
  const { loading, appointments, familyLookup, proctors } = useAppointmentData(
    selectedDate,
    currentUser?.id,
    currentUserRoles
  );

  const {
    selectedEmployeeId,
    setSelectedEmployeeId,
    examineeQuery,
    setExamineeQuery,
    filteredAppointments,
    groupedAppointments,
  } = useAppointmentFilters(appointments);

  return (
    <Container>
      <Section className="max-w-6xl mx-auto">
        <PageHeader
          title="Daily Proctoring Dashboard"
          description="Review and manage scheduled exam sessions"
          center
        />

        <AppointmentDatePicker date={selectedDate} onChange={setSelectedDate} />

        {loading && (
          <div className="text-center py-20">
            <Spinner size="xl" />
          </div>
        )}

        {!loading && filteredAppointments.length === 0 && (
          <Alert variant="info" className="mt-6">
            No appointments match the selected filters.
          </Alert>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          {employeeHasRole(currentUser, "admin") && (
            <EmployeeFilter
              employees={proctors}
              value={selectedEmployeeId}
              onChange={setSelectedEmployeeId}
            />
          )}
          <ExamineeFilter value={examineeQuery} onChange={setExamineeQuery} />
        </div>

        {!loading &&
          Object.entries(groupedAppointments).map(
            ([familyId, familyAppointments]) => (
              <AppointmentTableGroup
                key={familyId}
                familyId={familyId}
                familyName={familyLookup[familyId]}
                appointments={familyAppointments}
              />
            )
          )}
      </Section>
    </Container>
  );
}
