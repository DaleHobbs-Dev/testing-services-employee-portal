// Custom hook to filter and group appointments

import { useState, useMemo } from "react";

// Helper function to group appointments by test family
function groupByFamily(appointments) {
    const result = {};
    appointments.forEach((appt) => {
        if (!result[appt.familyId]) result[appt.familyId] = [];
        result[appt.familyId].push(appt);
    });
    return result;
}

export function useAppointmentFilters(appointments) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [examineeQuery, setExamineeQuery] = useState("");

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appt) => {
            // Filter by proctor
            if (selectedEmployeeId && appt.proctorId !== selectedEmployeeId) {
                return false;
            }

            // Filter by examinee name
            if (examineeQuery) {
                const q = examineeQuery.toLowerCase();
                if (!appt.examineeName.toLowerCase().includes(q)) {
                    return false;
                }
            }

            return true;
        });
    }, [appointments, selectedEmployeeId, examineeQuery]);

    const groupedAppointments = useMemo(
        () => groupByFamily(filteredAppointments),
        [filteredAppointments]
    );

    return {
        selectedEmployeeId,
        setSelectedEmployeeId,
        examineeQuery,
        setExamineeQuery,
        filteredAppointments,
        groupedAppointments,
    };
}