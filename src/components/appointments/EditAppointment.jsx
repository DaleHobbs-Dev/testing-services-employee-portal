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
  getAllLocations,
  getExamScheduleById,
  updateExamSchedule,
  getExamScheduleVariantsByScheduleId,
  createExamScheduleVariant,
  updateExamScheduleVariant,
  deleteExamScheduleVariant,
  getNotesByScheduleId,
} from "@/services";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { isFacultyTest } from "@/utils/testFamilyHelpers";

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
  const [existingVariants, setExistingVariants] = useState([]);
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
      getExamScheduleVariantsByScheduleId(scheduleId),
      getNotesByScheduleId(scheduleId),
    ]).then(
      ([
        examData,
        famData,
        varData,
        empData,
        locData,
        wsData,
        schedule,
        scheduleVariants,
        notes,
      ]) => {
        setExaminees(examData);
        setTestFamilies(famData.filter((f) => f.active !== false));
        setTestVariants(varData);
        setEmployees(empData);
        setLocations(locData);
        setWorkstations(wsData);
        setExistingVariants(scheduleVariants); // ✅ Store existing variants

        // Get variant IDs from junction table
        const variantIds = scheduleVariants.map((sv) => sv.testVariantId);

        // Get family ID from schedule (now stored directly)
        const familyId = schedule.testFamilyId;

        // Transform schedule data for form
        const examinee = examData.find((e) => e.id === schedule.examineeId);

        // Check if this is multi-variant based on count
        const isMultiVariant = variantIds.length > 1;

        setInitialData({
          examinee,
          appointmentDate: schedule.startTime,
          familyId: familyId,
          variantId: isMultiVariant ? null : variantIds[0],
          multiVariantIds: isMultiVariant ? variantIds : [],
          facultyData: {
            title: schedule.facultyTitle || "",
            facultyName: schedule.facultyName || "",
            course: schedule.course || "",
            duration: schedule.duration || "",
          },
          proctorId: schedule.employeeId,
          locationId: schedule.locationId,
          workstationId: schedule.workstationId,
          note: notes?.[0]?.message || "",
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

    // Validation
    if (!formData.selectedExaminee) return alert("Please select an examinee.");
    if (!formData.selectedFamilyId) return alert("Please choose a test type.");
    if (!formData.appointmentDate) return alert("Please choose a date.");
    if (!formData.selectedProctorId) return alert("Please select a proctor.");
    if (!formData.selectedLocationId) return alert("Please select a location.");
    if (!formData.selectedWorkstationId)
      return alert("Please select a workstation.");
    if (
      !formData.selectedVariantIds ||
      formData.selectedVariantIds.length === 0
    ) {
      return alert("Please select at least one test variant.");
    }

    const selectedFamily = testFamilies.find(
      (f) => f.id === Number(formData.selectedFamilyId)
    );

    try {
      // Step 1: ✅ Update the exam schedule (without variant data)
      const scheduleData = {
        examineeId: formData.selectedExaminee.id,
        testFamilyId: Number(formData.selectedFamilyId),
        employeeId: Number(formData.selectedProctorId),
        locationId: Number(formData.selectedLocationId),
        workstationId: Number(formData.selectedWorkstationId),
        startTime: formData.appointmentDate,
        endTime: formData.appointmentDate,
        room: "Room A",
      };

      // Faculty test data
      if (isFacultyTest(selectedFamily)) {
        scheduleData.facultyTitle = formData.facultyData.title;
        scheduleData.facultyName = formData.facultyData.facultyName;
        scheduleData.course = formData.facultyData.course;
        scheduleData.duration = formData.facultyData.duration;
      }

      await updateExamSchedule(scheduleId, scheduleData);

      // Step 2: ✅ Update junction table entries
      const currentVariantIds = existingVariants.map((ev) => ev.testVariantId);
      const newVariantIds = formData.selectedVariantIds;

      // Find variants to delete
      const variantsToDelete = existingVariants.filter(
        (ev) => !newVariantIds.includes(ev.testVariantId)
      );

      // Find variants to add
      const variantsToAdd = newVariantIds.filter(
        (id) => !currentVariantIds.includes(id)
      );

      // Find variants that stayed (to potentially update sequence)
      const variantsToKeep = existingVariants.filter((ev) =>
        newVariantIds.includes(ev.testVariantId)
      );

      // Delete removed variants
      for (const variant of variantsToDelete) {
        await deleteExamScheduleVariant(variant.id); // Hard delete
        // OR: await updateExamScheduleVariant(variant.id, { status: 'cancelled' }); // Soft delete
      }

      // Add new variants
      for (let i = 0; i < variantsToAdd.length; i++) {
        const variantId = variantsToAdd[i];
        // Calculate sequence order based on position in new list
        const sequenceOrder = newVariantIds.indexOf(variantId) + 1;

        await createExamScheduleVariant({
          examScheduleId: Number(scheduleId),
          testVariantId: variantId,
          sequenceOrder: sequenceOrder,
          status: "scheduled",
        });
      }

      // Update sequence order for kept variants (in case order changed)
      for (const variant of variantsToKeep) {
        const newSequenceOrder =
          newVariantIds.indexOf(variant.testVariantId) + 1;

        if (variant.sequenceOrder !== newSequenceOrder) {
          await updateExamScheduleVariant(variant.id, {
            sequenceOrder: newSequenceOrder,
          });
        }
      }

      alert("Appointment updated successfully!");
      navigate("/proctoring-dashboard");
    } catch (error) {
      console.error("Failed to update appointment:", error);
      alert("Failed to update appointment. Please try again.");
    }
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
