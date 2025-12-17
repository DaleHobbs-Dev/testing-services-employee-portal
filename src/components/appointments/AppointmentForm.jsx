import { useState } from "react";
import { Input, H2 } from "@/components/ui";
import { CalendarIcon } from "@heroicons/react/24/outline";
import ExamineeSelector from "./ExamineeSelector";
import TestSelector from "./TestSelector";
import FacultyTestFields from "./FacultyTestFields";
import ProctorSelector from "./ProctorSelector";
import WorkstationSelector from "./WorkstationSelector";
import AppointmentNotes from "./AppointmentNotes";
import LocationSelector from "./LocationSelector";

export default function AppointmentForm({
  examinees,
  testFamilies,
  testVariants,
  employees,
  locations,
  workstations,
  initialData = {},
  onExamineeAdded,
  children,
}) {
  const [selectedExaminee, setSelectedExaminee] = useState(
    initialData.examinee || null
  );
  const [appointmentDate, setAppointmentDate] = useState(
    initialData.appointmentDate || ""
  );
  const [selectedFamilyId, setSelectedFamilyId] = useState(
    initialData.familyId || null
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialData.variantId || null
  );
  const [multiVariantIds, setMultiVariantIds] = useState(
    initialData.multiVariantIds || []
  );
  const [facultyData, setFacultyData] = useState(
    initialData.facultyData || {
      title: "",
      facultyName: "",
      course: "",
      duration: "",
    }
  );
  const [selectedProctorId, setSelectedProctorId] = useState(
    initialData.proctorId || null
  );
  const [selectedLocationId, setSelectedLocationId] = useState(
    initialData.locationId || null
  );
  const [selectedWorkstationId, setSelectedWorkstationId] = useState(
    initialData.workstationId || null
  );
  const [noteMessage, setNoteMessage] = useState(initialData.note || "");

  const selectedFamily = testFamilies.find(
    (family) => family.id === Number(selectedFamilyId)
  );

  const isFacultyTest = selectedFamily?.name === "Faculty Test";

  const isMultiVariantFamily =
    selectedFamily?.name === "HiSET" || selectedFamily?.name === "Accuplacer";

  const handleFamilyChange = (e) => {
    setSelectedFamilyId(e.target.value);
    setSelectedVariantId(null);
    setMultiVariantIds([]);
  };

  const handleMultiVariantToggle = (variantId) => {
    const id = Number(variantId);
    setMultiVariantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Reset workstation when location changes
  const handleLocationChange = (e) => {
    setSelectedLocationId(e.target.value);
    setSelectedWorkstationId(null); // Clear workstation selection
  };

  const getFormData = () => {
    // Normalize variant selection into a single array
    const selectedVariantIds = isMultiVariantFamily
      ? multiVariantIds
      : selectedVariantId
      ? [Number(selectedVariantId)]
      : [];

    return {
      selectedExaminee,
      appointmentDate,
      selectedFamilyId,
      selectedVariantId,
      selectedVariantIds,
      facultyData,
      selectedProctorId,
      selectedLocationId,
      selectedWorkstationId,
      noteMessage,
    };
  };

  return (
    <>
      <ExamineeSelector
        examinees={examinees}
        selectedExaminee={selectedExaminee}
        onExamineeSelected={setSelectedExaminee}
        onExamineeAdded={onExamineeAdded}
      />

      {/* DATE PICKER */}
      <H2 className="my-4">
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          <CalendarIcon className="w-8 h-8 text-primary" />
          Appointment Date & Time
        </div>
      </H2>
      <Input
        type="datetime-local"
        step="900"
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
      />

      <TestSelector
        testFamilies={testFamilies}
        testVariants={testVariants}
        selectedFamilyId={selectedFamilyId}
        selectedVariantId={selectedVariantId}
        multiVariantIds={multiVariantIds}
        onFamilyChange={handleFamilyChange}
        onVariantChange={(e) => setSelectedVariantId(e.target.value)}
        onMultiVariantChange={handleMultiVariantToggle}
      />

      {isFacultyTest && (
        <FacultyTestFields
          facultyData={facultyData}
          onChange={setFacultyData}
        />
      )}

      <ProctorSelector
        employees={employees}
        selectedProctorId={selectedProctorId}
        onChange={(e) => setSelectedProctorId(e.target.value)}
      />

      <LocationSelector
        locations={locations}
        selectedLocationId={selectedLocationId}
        onChange={handleLocationChange}
      />

      <WorkstationSelector
        workstations={workstations}
        selectedWorkstationId={selectedWorkstationId}
        selectedLocationId={selectedLocationId}
        onChange={(e) => setSelectedWorkstationId(e.target.value)}
      />

      <AppointmentNotes
        value={noteMessage}
        onChange={(e) => setNoteMessage(e.target.value)}
      />

      {typeof children === "function" ? children(getFormData) : children}
    </>
  );
}
