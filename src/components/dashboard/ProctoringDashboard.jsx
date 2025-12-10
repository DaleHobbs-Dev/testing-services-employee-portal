import { useEffect, useState } from "react";
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

import {
  getAllExamSchedules,
  getAllExaminees,
  getAllEmployees,
  getAllTestFamilies,
  getAllTestVariants,
} from "@/services";

// Utility helper to group by family
function groupByFamily(appointments) {
  const result = {};
  appointments.forEach((appt) => {
    if (!result[appt.familyId]) result[appt.familyId] = [];
    result[appt.familyId].push(appt);
  });
  return result;
}

export default function ProctoringDashboard() {
  const { currentUser } = useCurrentUser();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [familyLookup, setFamilyLookup] = useState({});
  const [employeeLookup, setEmployeeLookup] = useState({});
  const [variantLookup, setVariantLookup] = useState({});
  const [examineeLookup, setExamineeLookup] = useState({});

  // =========================
  // LOAD ALL SUPPORTING DATA
  // =========================
  useEffect(() => {
    async function loadAll() {
      setLoading(true);

      const [schedules, examinees, employees, families, variants] =
        await Promise.all([
          getAllExamSchedules(),
          getAllExaminees(),
          getAllEmployees(),
          getAllTestFamilies(),
          getAllTestVariants(),
        ]);

      // Build lookup maps
      const famMap = Object.fromEntries(families.map((f) => [f.id, f.name]));
      const empMap = Object.fromEntries(employees.map((e) => [e.id, e]));
      const varMap = Object.fromEntries(variants.map((v) => [v.id, v]));
      const exaMap = Object.fromEntries(examinees.map((x) => [x.id, x]));

      setFamilyLookup(famMap);
      setEmployeeLookup(empMap);
      setVariantLookup(varMap);
      setExamineeLookup(exaMap);

      // Filter schedules by selected date
      const selectedStr = selectedDate.toISOString().slice(0, 10);

      const filteredSchedules = schedules.filter((s) => {
        const start = new Date(s.startTime).toISOString().slice(0, 10);
        return start === selectedStr;
      });

      // Normalize appointments into a consistent object
      const normalized = filteredSchedules.map((s) => {
        const variant = varMap[s.testVariantId] || null;
        return {
          id: s.id,
          familyId: variant?.familyId,
          familyName: famMap[variant?.familyId] || "Unknown Family",

          startTime: s.startTime,
          endTime: s.endTime,

          workstationId: s.workstationId,
          workstationLabel: `WS-${s.workstationId}`,

          proctorId: s.employeeId,
          proctorName: empMap[s.employeeId]?.name || "Unknown",

          variantTitle: variant?.title || "Unknown Variant",

          examineeId: s.examineeId,
          examineeName: exaMap[s.examineeId]?.firstName
            ? `${exaMap[s.examineeId].firstName} ${
                exaMap[s.examineeId].lastName
              }`
            : "Unknown Examinee",

          status: s.status || "scheduled",
          note: s.note || "",
        };
      });

      setAppointments(normalized);
      setLoading(false);
    }

    loadAll();
  }, [selectedDate]);

  // ===================================
  // FILTER APPOINTMENTS BASED ON ROLE
  // ===================================

  const visibleAppointments =
    currentUser?.role === "admin"
      ? appointments
      : appointments.filter((a) => a.proctorId === currentUser?.id);

  // Group appointments by test family
  const grouped = groupByFamily(visibleAppointments);

  return (
    <Container>
      <Section className="max-w-6xl mx-auto">
        <PageHeader
          title="Daily Proctoring Dashboard"
          description="Review and manage scheduled exam sessions"
          center
        />

        {/* DATE PICKER */}
        <AppointmentDatePicker date={selectedDate} onChange={setSelectedDate} />

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <Spinner size="xl" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && visibleAppointments.length === 0 && (
          <Alert variant="info" className="mt-6">
            No appointments scheduled for this date.
          </Alert>
        )}

        {/* TABLE GROUPS */}
        {!loading &&
          Object.entries(grouped).map(([familyId, familyAppointments]) => (
            <AppointmentTableGroup
              key={familyId}
              familyId={familyId}
              familyName={familyLookup[familyId]}
              appointments={familyAppointments}
            />
          ))}
      </Section>
    </Container>
  );
}
