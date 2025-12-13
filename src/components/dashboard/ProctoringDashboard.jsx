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
import EmployeeFilter from "../filters/EmployeeFilter";
import ExamineeFilter from "../filters/ExamineeFilter";

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
  const [proctors, setProctors] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [examineeQuery, setExamineeQuery] = useState("");

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

      const proctors = employees.filter(
        (e) => e.role === "proctor" && e.status === "active"
      );
      setProctors(proctors);

      // Filter schedules by selected date
      const selectedStr = selectedDate.toISOString().slice(0, 10);

      const filteredSchedules = schedules.filter((s) => {
        const start = new Date(s.startTime).toISOString().slice(0, 10);
        return start === selectedStr;
      });

      // Normalize appointments into a consistent object
      const normalized = filteredSchedules.map((s) => {
        const variantIds =
          s.selectedTestVariantIds ??
          (s.testVariantId ? [s.testVariantId] : []);

        const variants = variantIds.map((id) => varMap[id]).filter(Boolean);

        const familyId = variants[0]?.familyId;
        const familyName = famMap[familyId] || "Unknown Family";

        return {
          id: s.id,

          familyId,
          familyName,

          startTime: s.startTime,
          endTime: s.endTime,

          workstationId: s.workstationId,
          workstationLabel: `WS-${s.workstationId}`,

          proctorId: s.employeeId,
          proctorName: empMap[s.employeeId]?.name || "Unknown",

          examineeId: s.examineeId,
          examineeName: exaMap[s.examineeId]
            ? `${exaMap[s.examineeId].firstName} ${
                exaMap[s.examineeId].lastName
              }`
            : "Unknown Examinee",

          // 👇 NEW
          variantCount: variants.length,
          variantTitles: variants.map((v) => v.title),

          // 👇 Computed note
          note:
            variants.length > 1
              ? `Includes subtests: ${variants.map((v) => v.title).join(", ")}`
              : variants[0]?.title ?? "Unknown Variant",

          status: s.status || "scheduled",
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

  const filteredAppointments = visibleAppointments.filter((appt) => {
    // Admin-only: filter by proctor
    if (selectedEmployeeId && appt.proctorId !== selectedEmployeeId) {
      return false;
    }

    // Examinee name search (case-insensitive)
    if (examineeQuery) {
      const q = examineeQuery.toLowerCase();
      if (!appt.examineeName.toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Group appointments by test family
  const grouped = groupByFamily(filteredAppointments);

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
        {!loading && filteredAppointments.length === 0 && (
          <Alert variant="info" className="mt-6">
            No appointments match the selected filters.
          </Alert>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          {/* Admin-only employee filter */}
          {currentUser.role === "admin" && (
            <EmployeeFilter
              employees={proctors}
              value={selectedEmployeeId}
              onChange={setSelectedEmployeeId}
            />
          )}

          {/* Everyone gets examinee search */}
          <ExamineeFilter value={examineeQuery} onChange={setExamineeQuery} />
        </div>

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
