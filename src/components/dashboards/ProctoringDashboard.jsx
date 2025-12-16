import { useState } from "react";
import {
  Container,
  Section,
  PageHeader,
  Spinner,
  Alert,
} from "@/components/ui";
import { useCurrentUser } from "@/context/CurrentUserContext";
import AppointmentDatePicker from "@/components/appointments/AppointmentDatePicker";
import AppointmentTableGroup from "@/components/appointments/AppointmentTableGroup";
import EmployeeFilter from "../filters/EmployeeFilter";
import ExamineeFilter from "../filters/ExamineeFilter";
import { useAppointmentData, useAppointmentFilters } from "@/hooks";

export default function ProctoringDashboard() {
  const { currentUser } = useCurrentUser();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const { loading, appointments, familyLookup, proctors } = useAppointmentData(
    selectedDate,
    currentUser?.id,
    currentUser?.role
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
          {currentUser.role === "admin" && (
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
