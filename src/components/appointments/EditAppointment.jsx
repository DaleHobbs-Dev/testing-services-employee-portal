import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  PageHeader,
  Section,
  Container,
  Spinner,
} from "@/components/ui";
import {
  getAllExaminees,
  getAllTestFamilies,
  getAllTestVariants,
  getAllEmployees,
  getAllWorkstations,
  getExamScheduleById,
  updateExamSchedule,
} from "@/services";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { getAllLocations } from "../../services";

export default function EditAppointment() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [examinees, setExaminees] = useState([]);
  const [testFamilies, setTestFamilies] = useState([]);
  const [testVariants, setTestVariants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllExaminees(),
      getAllTestFamilies(),
      getAllTestVariants(),
      getAllEmployees(),
      getAllLocations(),
      getAllWorkstations(),
      getExamScheduleById(scheduleId),
    ]).then(
      ([examData, famData, varData, empData, locData, wsData, schedule]) => {
        setExaminees(examData);
        setTestFamilies(famData.filter((f) => f.active !== false));
        setTestVariants(varData);
        setEmployees(empData);
        setLocations(locData);
        setWorkstations(wsData);

        // Transform schedule data for form
        const examinee = examData.find((e) => e.id === schedule.examineeId);
        setInitialData({
          examinee,
          appointmentDate: schedule.startTime,
          familyId: schedule.testVariantId
            ? varData.find((v) => v.id === schedule.testVariantId)?.familyId
            : null,
          variantId: schedule.testVariantId,
          multiVariantIds: schedule.selectedTestVariantIds || [],
          proctorId: schedule.employeeId,
          locationId: schedule.locationId,
          workstationId: schedule.workstationId,
          note: "", // You'd need to fetch this separately
        });

        setLoading(false);
      }
    );
  }, [scheduleId]);

  const handleExamineeAdded = (newExaminee) => {
    setExaminees([...examinees, newExaminee]);
  };

  const handleSubmit = (getFormData) => async () => {
    const formData = getFormData();

    await updateExamSchedule(scheduleId, formData);

    alert("Appointment updated successfully!");
    navigate("/proctoring-dashboard");
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <Container>
      <Section className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Edit Testing Appointment"
          description="Update appointment details."
          center
        />

        <Card className="p-8 shadow-md">
          <AppointmentForm
            examinees={examinees}
            testFamilies={testFamilies}
            testVariants={testVariants}
            employees={employees}
            locations={locations}
            workstations={workstations}
            initialData={initialData}
            onExamineeAdded={handleExamineeAdded}
          >
            {(getFormData) => (
              <Button
                className="mt-10"
                variant="primary"
                onClick={handleSubmit(getFormData)}
              >
                <div className="p-2 flex items-center gap-3 rounded-lg bg-primary text-white">
                  <CheckCircleIcon className="w-5 h-5 mr-2 inline" />
                  Update Appointment
                </div>
              </Button>
            )}
          </AppointmentForm>
        </Card>
      </Section>
    </Container>
  );
}
