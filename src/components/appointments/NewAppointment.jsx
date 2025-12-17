import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader, Section, Container } from "@/components/ui";
import {
  getAllExaminees,
  getAllTestFamilies,
  getAllTestVariants,
  getAllEmployees,
  getAllWorkstations,
  getAllLocations,
  createExamSchedule,
  createExamScheduleVariant,
  createNote,
} from "@/services";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { isFacultyTest } from "@/utils/testFamilyHelpers";

export default function NewAppointment() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

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

    // Validation
    if (!formData.selectedExaminee)
      return alert("Please select or create an examinee.");
    if (!formData.selectedFamilyId) return alert("Please choose a test type.");
    if (!formData.appointmentDate) return alert("Please choose a date.");
    if (!formData.selectedProctorId) return alert("Please select a proctor.");
    if (!formData.selectedLocationId) return alert("Please select a location.");
    if (!formData.selectedWorkstationId)
      return alert("Please select a workstation.");

    // Validate that variants are selected
    if (
      !formData.selectedVariantIds ||
      formData.selectedVariantIds.length === 0
    ) {
      return alert("Please select at least one test variant.");
    }

    const selectedFamily = testFamilies.find(
      (f) => f.id === Number(formData.selectedFamilyId)
    );

    // Create exam schedule WITHOUT variant IDs
    const scheduleData = {
      examineeId: formData.selectedExaminee.id,
      testFamilyId: Number(formData.selectedFamilyId), // Store family ID
      employeeId: Number(formData.selectedProctorId),
      locationId: Number(formData.selectedLocationId),
      workstationId: Number(formData.selectedWorkstationId),
      startTime: formData.appointmentDate,
      endTime: formData.appointmentDate,
      room: "Room A",
      status: "scheduled",
    };

    // Faculty test data (if needed, could move to variants table)
    if (isFacultyTest(selectedFamily)) {
      scheduleData.facultyTitle = formData.facultyData.title;
      scheduleData.facultyName = formData.facultyData.facultyName;
      scheduleData.course = formData.facultyData.course;
      scheduleData.duration = formData.facultyData.duration;
    }

    try {
      // Step 1: Create the exam schedule
      const createdSchedule = await createExamSchedule(scheduleData);

      // Step 2: Create junction table entries for each variant
      for (let i = 0; i < formData.selectedVariantIds.length; i++) {
        await createExamScheduleVariant({
          examScheduleId: createdSchedule.id,
          testVariantId: formData.selectedVariantIds[i],
          sequenceOrder: i + 1, // Order they'll take the tests
          status: "scheduled",
        });
      }

      // Step 3: Create note if provided
      if (formData.noteMessage.trim().length > 0) {
        await createNote({
          examScheduleId: createdSchedule.id,
          message: formData.noteMessage,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.id,
        });
      }

      alert("Appointment created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to create appointment:", error);
      alert("Failed to create appointment. Please try again.");
    }
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
