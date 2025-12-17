import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, Section, Container } from "@/components/ui";
import {
  getAllExaminees,
  getAllTestFamilies,
  getAllTestVariants,
  getAllEmployees,
  getAllWorkstations,
  createExamSchedule,
  createNote,
  getAllLocations,
} from "@/services";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import AppointmentForm from "@/components/appointments/AppointmentForm";

export default function NewAppointment() {
  const navigate = useNavigate();

  const [examinees, setExaminees] = useState([]);
  const [testFamilies, setTestFamilies] = useState([]);
  const [testVariants, setTestVariants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getAllExaminees().then(setExaminees);
    getAllTestFamilies().then((data) =>
      setTestFamilies(data.filter((f) => f.active !== false))
    );
    getAllTestVariants().then(setTestVariants);
    getAllEmployees().then(setEmployees);
    getAllWorkstations().then(setWorkstations);
    getAllLocations().then(setLocations);
  }, []);

  const handleExamineeAdded = (newExaminee) => {
    setExaminees([...examinees, newExaminee]);
  };

  const handleSubmit = (getFormData) => async () => {
    const formData = getFormData();

    if (!formData.selectedExaminee)
      return alert("Please select or create an examinee.");
    if (!formData.selectedFamilyId) return alert("Please choose a test type.");
    if (!formData.appointmentDate) return alert("Please choose a date.");
    if (!formData.selectedProctorId) return alert("Please select a proctor.");
    if (!formData.selectedLocationId) return alert("Please select a location.");
    if (!formData.selectedWorkstationId)
      return alert("Please select a workstation.");

    const selectedFamily = testFamilies.find(
      (f) => f.id === Number(formData.selectedFamilyId)
    );
    const isMultiVariantFamily =
      selectedFamily?.name === "HiSET" || selectedFamily?.name === "Accuplacer";
    const isFacultyTest = selectedFamily?.name === "Faculty Test";

    const scheduleData = {
      examineeId: formData.selectedExaminee.id,
      employeeId: Number(formData.selectedProctorId),
      locationId: Number(formData.selectedLocationId),
      workstationId: Number(formData.selectedWorkstationId),
      startTime: formData.appointmentDate,
      endTime: formData.appointmentDate,
      room: "Room A",
    };

    if (isMultiVariantFamily) {
      scheduleData.selectedTestVariantIds = formData.multiVariantIds;
    } else {
      scheduleData.testVariantId = Number(formData.selectedVariantId);
    }

    if (isFacultyTest) {
      scheduleData.facultyTitle = formData.facultyData.title;
      scheduleData.facultyName = formData.facultyData.facultyName;
      scheduleData.course = formData.facultyData.course;
      scheduleData.duration = formData.facultyData.duration;
    }

    const createdSchedule = await createExamSchedule(scheduleData);

    if (formData.noteMessage.trim().length > 0) {
      await createNote({
        examScheduleId: createdSchedule.id,
        message: formData.noteMessage,
      });
    }

    alert("Appointment created successfully!");
    navigate("/");
  };

  return (
    <Container>
      <Section className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="New Testing Appointment"
          description="Create a new appointment for a student or examinee."
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
                  Create Appointment
                </div>
              </Button>
            )}
          </AppointmentForm>
        </Card>
      </Section>
    </Container>
  );
}
