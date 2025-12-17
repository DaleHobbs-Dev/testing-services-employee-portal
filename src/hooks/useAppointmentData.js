import { useState, useEffect } from "react";
import {
    getAllExamSchedules,
    getAllExamScheduleVariants, // ✅ NEW
    getAllTestVariants,
    getAllExaminees,
    getAllEmployees,
    getAllTestFamilies,
} from "@/services";

export function useAppointmentData(selectedDate, currentUserId, currentUserRole) {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [familyLookup, setFamilyLookup] = useState({});
    const [proctors, setProctors] = useState([]);

    useEffect(() => {
        async function loadAll() {
            setLoading(true);

            const [schedules, scheduleVariants, variants, examinees, employees, families] =
                await Promise.all([
                    getAllExamSchedules(),
                    getAllExamScheduleVariants(), // ✅ NEW: Get junction table data
                    getAllTestVariants(),
                    getAllExaminees(),
                    getAllEmployees(),
                    getAllTestFamilies(),
                ]);

            // Build lookup maps
            const famMap = Object.fromEntries(families.map((f) => [f.id, f.name]));
            const empMap = Object.fromEntries(employees.map((e) => [e.id, e]));
            const varMap = Object.fromEntries(variants.map((v) => [v.id, v]));
            const exaMap = Object.fromEntries(examinees.map((x) => [x.id, x]));

            setFamilyLookup(famMap);

            const activeProctors = employees.filter(
                (e) => (e.role === "proctor" || e.role === "admin") && e.status === "active"
            );
            setProctors(activeProctors);

            // Filter schedules by selected date
            const selectedStr = selectedDate.toISOString().slice(0, 10);

            const filteredSchedules = schedules.filter((s) => {
                const start = new Date(s.startTime).toISOString().slice(0, 10);
                return start === selectedStr;
            });

            // ✅ UPDATED: Build variant lookup by schedule ID
            const variantsBySchedule = scheduleVariants.reduce((acc, sv) => {
                if (!acc[sv.examScheduleId]) {
                    acc[sv.examScheduleId] = [];
                }
                acc[sv.examScheduleId].push(sv);
                return acc;
            }, {});

            // Normalize appointments into a consistent object
            const normalized = filteredSchedules.map((s) => {
                // ✅ UPDATED: Get variants from junction table
                const scheduleVariantsForThisSchedule = variantsBySchedule[s.id] || [];

                // Sort by sequence order
                scheduleVariantsForThisSchedule.sort((a, b) => a.sequenceOrder - b.sequenceOrder);

                // Get the actual variant objects
                const examVariants = scheduleVariantsForThisSchedule
                    .map(sv => varMap[sv.testVariantId])
                    .filter(Boolean);

                // ✅ UPDATED: Get family ID directly from schedule
                const familyId = s.testFamilyId;
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

                    variantCount: examVariants.length,
                    variantTitles: examVariants.map((v) => v.title),

                    note:
                        examVariants.length > 1
                            ? `${examVariants.length} tests: ${examVariants.map((v) => v.title).join(", ")}`
                            : examVariants[0]?.title ?? "Unknown Variant",

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