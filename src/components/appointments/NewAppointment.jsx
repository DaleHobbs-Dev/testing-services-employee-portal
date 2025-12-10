import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import {
  Button,
  Input,
  Label,
  H2,
  H3,
  Card,
  Alert,
  Select,
  PageHeader,
  Section,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@/components/ui";
import {
  getAllExaminees,
  getAllTestFamilies,
  getAllTestVariants,
  getAllEmployees,
  getAllWorkstations,
  createExamSchedule,
  createExaminee,
  createNote,
} from "@/services";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function NewAppointment() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  // ===========================
  // DATA STATE
  // ===========================
  const [examinees, setExaminees] = useState([]);
  const [testFamilies, setTestFamilies] = useState([]);
  const [testVariants, setTestVariants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [workstations, setWorkstations] = useState([]);

  // ===========================
  // FORM STATE
  // ===========================
  const [selectedExaminee, setSelectedExaminee] = useState(null);
  const [emailSearch, setEmailSearch] = useState("");
  const [newExamineeData, setNewExamineeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [multiVariantIds, setMultiVariantIds] = useState([]);

  const [facultyData, setFacultyData] = useState({
    title: "",
    facultyName: "",
    course: "",
    duration: "",
  });

  const [selectedProctorId, setSelectedProctorId] = useState(null);
  const [selectedWorkstationId, setSelectedWorkstationId] = useState(null);
  const [noteMessage, setNoteMessage] = useState("");

  // Add Examinee Modal
  const [showAddExamineeModal, setShowAddExamineeModal] = useState(false);

  // ===========================
  // LOAD INITIAL DATA
  // ===========================
  useEffect(() => {
    getAllExaminees().then(setExaminees);
    getAllTestFamilies().then(setTestFamilies);
    getAllTestVariants().then(setTestVariants);
    getAllEmployees().then(setEmployees);
    getAllWorkstations().then(setWorkstations);
  }, []);

  // ===========================
  // HELPERS
  // ===========================
  const handleSearchByEmail = () => {
    const found = examinees.find(
      (e) => e.email.toLowerCase() === emailSearch.toLowerCase()
    );
    if (found) setSelectedExaminee(found);
    else alert("No examinee found with that email.");
  };

  const handleAddNewExaminee = () => {
    createExaminee(newExamineeData).then((created) => {
      setExaminees([...examinees, created]);
      setSelectedExaminee(created);
      setShowAddExamineeModal(false);
    });
  };

  const selectedFamily = testFamilies.find(
    (family) => family.id === Number(selectedFamilyId)
  );

  const variantsForFamily = testVariants.filter(
    (variant) => variant.familyId === Number(selectedFamilyId)
  );

  const isMultiVariantFamily =
    selectedFamily?.name === "HiSET" || selectedFamily?.name === "Accuplacer";

  const isFacultyTest = selectedFamily?.name === "Faculty Test";

  // ===========================
  // SUBMISSION
  // ===========================
  const handleSubmit = async () => {
    if (!selectedExaminee) return alert("Please select or create an examinee.");
    if (!selectedFamilyId) return alert("Please choose a test type.");
    if (!appointmentDate) return alert("Please choose a date.");
    if (!selectedProctorId) return alert("Please select a proctor.");
    if (!selectedWorkstationId) return alert("Please select a workstation.");

    // Build examSchedule object
    const scheduleData = {
      examineeId: selectedExaminee.id,
      employeeId: Number(selectedProctorId),
      workstationId: Number(selectedWorkstationId),
      startTime: appointmentDate, // You may add time selection later
      endTime: appointmentDate, // Placeholder until time UI added
      room: "Room A", // Hardcoded; you can add UI for this
    };

    // test variants
    if (isMultiVariantFamily) {
      scheduleData.selectedTestVariantIds = multiVariantIds;
    } else {
      scheduleData.testVariantId = Number(selectedVariantId);
    }

    // faculty fields if needed
    if (isFacultyTest) {
      scheduleData.facultyTitle = facultyData.title;
      scheduleData.facultyName = facultyData.facultyName;
      scheduleData.course = facultyData.course;
      scheduleData.duration = facultyData.duration;
    }

    const createdSchedule = await createExamSchedule(scheduleData);

    // Add note if provided
    if (noteMessage.trim().length > 0) {
      await createNote({
        examScheduleId: createdSchedule.id,
        message: noteMessage,
      });
    }

    alert("Appointment created successfully!");

    if (currentUser.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  // ===========================
  // UI
  // ===========================
  return (
    <Container>
      <Section className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="New Testing Appointment"
          description="Create a new appointment for a student or examinee."
          center
        />

        <Card className="p-8 shadow-md">
          <H2 className="mb-4">
            <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
              <UserCircleIcon className="w-8 h-8 text-primary" />
              Examinee Information
            </div>
          </H2>

          {/* LOOKUP EXISTING */}
          <div className="mb-6">
            <Label>Email Lookup</Label>
            <div className="flex gap-3 mt-2">
              <Input
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                placeholder="Enter examinee email"
              />
              <Button onClick={handleSearchByEmail}>
                <MagnifyingGlassIcon className="w-5 h-5 mr-2 inline" />
                Search
              </Button>
            </div>
          </div>

          {/* SHOW SELECTED EXAMINEE */}
          {selectedExaminee && (
            <Alert className="bg-green-50 border-green-300 text-green-700 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 shrink-0" />
                <span>
                  Selected Examinee:{" "}
                  <strong>
                    {selectedExaminee.firstName} {selectedExaminee.lastName}
                  </strong>{" "}
                  ({selectedExaminee.email})
                </span>
              </div>
              <Button
                variant="outline"
                className="ml-4"
                onClick={() => {
                  setSelectedExaminee(null);
                  setEmailSearch("");
                }}
              >
                Select Different Examinee
              </Button>
            </Alert>
          )}

          <Button
            variant="accent"
            className="mb-8"
            onClick={() => setShowAddExamineeModal(true)}
          >
            <UserPlusIcon className="w-5 h-5 mr-2 inline" />
            Add New Examinee
          </Button>

          {/* DATE PICKER */}
          <H2 className="my-4">
            <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Appointment Date & Time
            </div>
          </H2>
          <Input
            type="datetime-local"
            step="900" // 900 seconds = 15 min increments
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />

          {/* TEST TYPE */}
          <H2 className="mt-8 mb-4">
            <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
              <ClipboardDocumentListIcon className="w-8 h-8 text-primary" />
              Test Information
            </div>
          </H2>

          <Label>Test Type</Label>
          <Select
            value={selectedFamilyId || ""}
            onChange={(e) => {
              setSelectedFamilyId(e.target.value);
              setSelectedVariantId(null);
              setMultiVariantIds([]);
            }}
          >
            <option value="">Select Test Type</option>
            {testFamilies.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </Select>

          {/* VARIANT SELECTOR */}
          {selectedFamily && (
            <>
              <H3 className="mt-6 mb-2">Test Variant</H3>

              {isMultiVariantFamily ? (
                <div className="flex flex-col gap-2">
                  {variantsForFamily.map((variant) => (
                    <label key={variant.id} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        value={variant.id}
                        checked={multiVariantIds.includes(variant.id)}
                        onChange={() => {
                          const id = Number(variant.id);
                          setMultiVariantIds((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          );
                        }}
                      />
                      {variant.title}
                    </label>
                  ))}
                </div>
              ) : (
                <Select
                  value={selectedVariantId || ""}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                >
                  <option value="">Select Variant</option>
                  {variantsForFamily.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                    </option>
                  ))}
                </Select>
              )}
            </>
          )}

          {/* FACULTY TEST FIELDS */}
          {isFacultyTest && (
            <div className="mt-6">
              <H3>Faculty Test Details</H3>

              <Label className="mt-3">Exam Title</Label>
              <Input
                value={facultyData.title}
                onChange={(e) =>
                  setFacultyData({ ...facultyData, title: e.target.value })
                }
              />

              <Label className="mt-3">Faculty Name</Label>
              <Input
                value={facultyData.facultyName}
                onChange={(e) =>
                  setFacultyData({
                    ...facultyData,
                    facultyName: e.target.value,
                  })
                }
              />

              <Label className="mt-3">Course</Label>
              <Input
                value={facultyData.course}
                onChange={(e) =>
                  setFacultyData({ ...facultyData, course: e.target.value })
                }
              />

              <Label className="mt-3">Duration (minutes)</Label>
              <Input
                type="number"
                value={facultyData.duration}
                onChange={(e) =>
                  setFacultyData({ ...facultyData, duration: e.target.value })
                }
              />
            </div>
          )}

          {/* PROCTOR */}
          <H2 className="mt-8 mb-4">
            <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
              <UserCircleIcon className="w-8 h-8 text-primary" />
              Proctor
            </div>
          </H2>
          <Select
            value={selectedProctorId || ""}
            onChange={(e) => setSelectedProctorId(e.target.value)}
          >
            <option value="">Select Proctor</option>
            {employees
              .filter((e) => e.role === "proctor" || e.role === "admin")
              .filter((e) => e.status === "active")
              .map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
          </Select>

          {/* WORKSTATION */}
          <H2 className="mt-8 mb-4">
            <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
              <ComputerDesktopIcon className="w-8 h-8 text-primary" />
              Workstation
            </div>
          </H2>
          <Select
            value={selectedWorkstationId || ""}
            onChange={(e) => setSelectedWorkstationId(e.target.value)}
          >
            <option value="">Select Workstation</option>
            {workstations.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.label} — {ws.room}
              </option>
            ))}
          </Select>

          {/* NOTES */}
          <H2 className="mt-8 mb-3">
            <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
              <DocumentTextIcon className="w-8 h-8 text-primary" />
              Optional Exam Notes
            </div>
          </H2>
          <Textarea
            placeholder="Add special instructions..."
            value={noteMessage}
            onChange={(e) => setNoteMessage(e.target.value)}
          />

          {/* SUBMIT */}
          <Button className="mt-10" variant="primary" onClick={handleSubmit}>
            <div className="p-2 flex items-center gap-3 rounded-lg bg-primary text-white">
              <CheckCircleIcon className="w-5 h-5 mr-2 inline" />
              Create Appointment
            </div>
          </Button>
        </Card>
      </Section>

      {/* ADD EXAMINEE MODAL */}
      <Modal
        isOpen={showAddExamineeModal}
        onClose={() => setShowAddExamineeModal(false)}
      >
        <ModalHeader>Add New Examinee</ModalHeader>
        <ModalBody>
          <Label>First Name</Label>
          <Input
            value={newExamineeData.firstName}
            onChange={(e) =>
              setNewExamineeData({
                ...newExamineeData,
                firstName: e.target.value,
              })
            }
          />

          <Label className="mt-3">Last Name</Label>
          <Input
            value={newExamineeData.lastName}
            onChange={(e) =>
              setNewExamineeData({
                ...newExamineeData,
                lastName: e.target.value,
              })
            }
          />

          <Label className="mt-3">Email</Label>
          <Input
            value={newExamineeData.email}
            onChange={(e) =>
              setNewExamineeData({ ...newExamineeData, email: e.target.value })
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowAddExamineeModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddNewExaminee}>
            Add Examinee
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}
