// Custom hook to fetch and process appointment data
import { useState, useEffect } from "react";
import {
    getAllExamSchedules,
    getAllExaminees,
    getAllEmployees,
    getAllTestFamilies,
    getAllTestVariants,
} from "@/services";

export function useAppointmentData(selectedDate, currentUserId, currentUserRole) {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [familyLookup, setFamilyLookup] = useState({});
    const [proctors, setProctors] = useState([]);

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

            const activeProctors = employees.filter(
                (e) => e.role === "proctor" && e.status === "active"
            );
            setProctors(activeProctors);

            // Filter schedules by selected date
            const selectedStr = selectedDate.toISOString().slice(0, 10);

            const filteredSchedules = schedules.filter((s) => {
                const start = new Date(s.startTime).toISOString().slice(0, 10);
                return start === selectedStr;
            });

            // Normalize appointments
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
                        ? `${exaMap[s.examineeId].firstName} ${exaMap[s.examineeId].lastName}`
                        : "Unknown Examinee",
                    variantCount: variants.length,
                    variantTitles: variants.map((v) => v.title),
                    note:
                        variants.length > 1
                            ? `Includes subtests: ${variants.map((v) => v.title).join(", ")}`
                            : variants[0]?.title ?? "Unknown Variant",
                    status: s.status || "scheduled",
                };
            });

            // Filter by role
            const visibleAppointments =
                currentUserRole === "admin"
                    ? normalized
                    : normalized.filter((a) => a.proctorId === currentUserId);

            setAppointments(visibleAppointments);
            setLoading(false);
        }

        loadAll();
    }, [selectedDate, currentUserId, currentUserRole]);

    return { loading, appointments, familyLookup, proctors };
}