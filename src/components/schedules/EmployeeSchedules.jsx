import { useEffect, useState } from "react";
import { Container, Section, PageHeader, Grid, Alert } from "@/components/ui";
import { getAllEmployees, getAllEmployeeSchedules } from "@/services";
import EmployeeScheduleCard from "./EmployeeScheduleCard";

export default function EmployeeSchedules() {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllEmployees(), getAllEmployeeSchedules()])
      .then(([empData, schedData]) => {
        setEmployees(empData.filter((e) => e.status === "active"));
        setSchedules(schedData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Alert>Loading schedules…</Alert>;
  }

  return (
    <Container>
      <Section className="max-w-6xl mx-auto">
        <PageHeader
          title="Employee Schedules"
          description="Set working days and hours for testing center staff."
          center
        />

        <Grid cols={2}>
          {employees.map((employee) => {
            const schedule = schedules.find(
              (s) => s.employeeId === employee.id
            );

            return (
              <EmployeeScheduleCard
                key={employee.id}
                employee={employee}
                schedule={schedule}
              />
            );
          })}
        </Grid>
      </Section>
    </Container>
  );
}
