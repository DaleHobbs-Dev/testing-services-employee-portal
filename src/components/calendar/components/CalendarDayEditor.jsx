import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  Select,
  Textarea,
} from "@/components";
import {
  DayNoteColorPicker,
  DEFAULT_DAY_NOTE_COLOR,
} from "@/components/calendar/components/DayNoteColorPicker";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";

const asString = (value) => (value === undefined || value === null ? "" : String(value));

const findForDayLocation = (items = [], date, locationId) =>
  items.find(
    (item) =>
      item.date === date && asString(item.locationId) === asString(locationId)
  );

const listForDayLocation = (items = [], date, locationId) =>
  items.filter(
    (item) =>
      item.date === date && asString(item.locationId) === asString(locationId)
  );

const getNoteColor = (note) =>
  note?.colorHex || note?.color || DEFAULT_DAY_NOTE_COLOR;

const DEFAULT_EMPLOYEE_START_TIME = "07:45";
const DEFAULT_EMPLOYEE_END_TIME = "16:15";

export function CalendarDayEditor({
  date,
  locationId,
  monthView = {},
  locations = [],
  employees = [],
  testFamilies = [],
  onSave,
  isSaving = false,
}) {
  const location = locations.find(
    (item) => asString(item.id) === asString(locationId)
  );

  const existingClosure = useMemo(
    () => findForDayLocation(monthView.closures, date, locationId),
    [date, locationId, monthView.closures]
  );

  const existingLabel = useMemo(
    () => findForDayLocation(monthView.labels, date, locationId),
    [date, locationId, monthView.labels]
  );

  const existingTestFamilyBadges = useMemo(
    () => listForDayLocation(monthView.testFamilyBadges, date, locationId),
    [date, locationId, monthView.testFamilyBadges]
  );

  const existingEmployeeBadges = useMemo(
    () => listForDayLocation(monthView.employeeBadges, date, locationId),
    [date, locationId, monthView.employeeBadges]
  );

  const existingNotes = useMemo(
    () => listForDayLocation(monthView.notes, date, locationId),
    [date, locationId, monthView.notes]
  );

  const [formData, setFormData] = useState(() => ({
    isClosed: !!existingClosure,
    closureReason: existingClosure?.reason || "",
    label: existingLabel?.label || "",
    showWhenClosed: !!existingLabel?.showWhenClosed,
    testFamilyId: "",
    testFamilyStartTime: "",
    testFamilyEndTime: "",
    employeeId: "",
    employeeStartTime: DEFAULT_EMPLOYEE_START_TIME,
    employeeEndTime: DEFAULT_EMPLOYEE_END_TIME,
    employeeLabelType: "",
    employeeCustomLabel: "",
    noteMessage: "",
    noteColorHex: DEFAULT_DAY_NOTE_COLOR,
  }));

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEmployeeLabelTypeChange = (labelType) => {
    setFormData((prev) => ({
      ...prev,
      employeeLabelType: prev.employeeLabelType === labelType ? "" : labelType,
      employeeStartTime:
        prev.employeeLabelType === labelType ? DEFAULT_EMPLOYEE_START_TIME : "",
      employeeEndTime:
        prev.employeeLabelType === labelType ? DEFAULT_EMPLOYEE_END_TIME : "",
      employeeCustomLabel:
        labelType === "custom" && prev.employeeLabelType !== "custom"
          ? prev.employeeCustomLabel
          : "",
    }));
  };

  const getTestFamilyName = (badge) => {
    const testFamily = testFamilies.find(
      (item) => asString(item.id) === asString(badge.testFamilyId)
    );

    return testFamily?.name || testFamily?.label || "Test Type";
  };

  const getEmployeeName = (badge) => {
    const employee = employees.find(
      (item) => asString(item.id) === asString(badge.employeeId)
    );

    return getEmployeeDisplayName(employee);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const employeeCustomLabel =
      formData.employeeLabelType === "custom"
        ? formData.employeeCustomLabel
        : formData.employeeLabelType;

    const newEmployeeBadge =
      formData.employeeId &&
      (employeeCustomLabel ||
        (formData.employeeStartTime && formData.employeeEndTime))
        ? {
            employeeId: formData.employeeId,
            startTime: employeeCustomLabel ? null : formData.employeeStartTime,
            endTime: employeeCustomLabel ? null : formData.employeeEndTime,
            customLabel: employeeCustomLabel || null,
          }
        : null;

    onSave({
      date,
      locationId,
      existingClosure,
      existingLabel,
      isClosed: formData.isClosed,
      closureReason: formData.closureReason,
      label: formData.label,
      showWhenClosed: formData.showWhenClosed,
      testFamilyBadge:
        formData.testFamilyId &&
        formData.testFamilyStartTime &&
        formData.testFamilyEndTime
          ? {
              testFamilyId: formData.testFamilyId,
              locationIds: [locationId],
              dates: [date],
              startTime: formData.testFamilyStartTime,
              endTime: formData.testFamilyEndTime,
            }
          : null,
      employeeBadge: newEmployeeBadge
        ? {
            ...newEmployeeBadge,
            locationIds: [locationId],
            dates: [date],
          }
        : null,
      note: formData.noteMessage
        ? {
            locationId,
            date,
            message: formData.noteMessage,
            color: formData.noteColorHex,
          }
        : null,
    });
  };

  if (!date) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Day Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-adaptive-muted">
            Select a day on the calendar to edit it.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!locationId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Day Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            Choose a location before editing calendar days.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editing {date}</CardTitle>
        <p className="text-sm text-adaptive-muted">
          {location?.name || "Selected location"}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <label className="flex items-center gap-2 text-sm font-medium text-adaptive">
              <input
                type="checkbox"
                name="isClosed"
                checked={formData.isClosed}
                onChange={handleChange}
              />
              Testing Center Closed
            </label>
            <Input
              name="closureReason"
              value={formData.closureReason}
              onChange={handleChange}
              placeholder="Closure reason"
              className="mt-2"
            />
          </section>

          <section>
            <FormField label="Custom Label">
              <Input
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="Example: Finals Week"
              />
            </FormField>
            <label className="flex items-center gap-2 text-sm text-adaptive">
              <input
                type="checkbox"
                name="showWhenClosed"
                checked={formData.showWhenClosed}
                onChange={handleChange}
              />
              Show label when closed
            </label>
          </section>

          <section className="rounded-lg border border-adaptive p-4">
            <h3 className="mb-3 font-semibold text-primary">
              Add a Test Type
            </h3>
            <FormField label="Test Type">
              <Select
                name="testFamilyId"
                value={formData.testFamilyId}
                onChange={handleChange}
              >
                <option value="">Select test type</option>
                {testFamilies.map((testFamily) => (
                  <option key={testFamily.id} value={testFamily.id}>
                    {testFamily.name || testFamily.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="time"
                name="testFamilyStartTime"
                value={formData.testFamilyStartTime}
                onChange={handleChange}
              />
              <Input
                type="time"
                name="testFamilyEndTime"
                value={formData.testFamilyEndTime}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="rounded-lg border border-adaptive p-4">
            <h3 className="mb-3 font-semibold text-primary">
              Add Employee Schedule
            </h3>
            <FormField label="Employee">
              <Select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {getEmployeeDisplayName(employee)}
                  </option>
                ))}
              </Select>
            </FormField>
            {!formData.employeeLabelType && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="time"
                  name="employeeStartTime"
                  value={formData.employeeStartTime}
                  onChange={handleChange}
                />
                <Input
                  type="time"
                  name="employeeEndTime"
                  value={formData.employeeEndTime}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {[
                  { label: "OFF", value: "OFF" },
                  { label: "REQUESTED OFF", value: "REQUESTED OFF" },
                  { label: "CUSTOM LABEL", value: "custom" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-sm text-adaptive"
                  >
                    <input
                      type="checkbox"
                      checked={formData.employeeLabelType === option.value}
                      onChange={() =>
                        handleEmployeeLabelTypeChange(option.value)
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              {formData.employeeLabelType === "custom" && (
                <Input
                  name="employeeCustomLabel"
                  value={formData.employeeCustomLabel}
                  onChange={handleChange}
                  placeholder="Custom schedule label"
                />
              )}
            </div>
          </section>

          <section className="rounded-lg border border-adaptive p-4">
            <h3 className="mb-3 font-semibold text-primary">
              Add a Special Note
            </h3>
            <FormField label="Add Note">
              <Textarea
                name="noteMessage"
                value={formData.noteMessage}
                onChange={handleChange}
                placeholder="Add a day note"
              />
            </FormField>
            <FormField label="Note Color">
              <DayNoteColorPicker
                value={formData.noteColorHex}
                onChange={(colorHex) =>
                  setFormData((prev) => ({ ...prev, noteColorHex: colorHex }))
                }
              />
            </FormField>
          </section>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Day"}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <section>
            <h3 className="font-semibold text-adaptive">Existing Entries</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {existingTestFamilyBadges.map((badge) => (
                <Badge key={`tf-${badge.id}`} variant="primary">
                  {getTestFamilyName(badge)} {badge.startTime}-{badge.endTime}
                </Badge>
              ))}
              {existingEmployeeBadges.map((badge) => (
                <Badge key={`emp-${badge.id}`} variant="accent">
                  {getEmployeeName(badge)}{" "}
                  {badge.customLabel || `${badge.startTime}-${badge.endTime}`}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-adaptive">Notes</h3>
            <div className="mt-2 space-y-2">
              {existingNotes.length === 0 ? (
                <p className="text-sm text-adaptive-muted">No notes yet.</p>
              ) : (
                existingNotes.map((note) => (
                  <p
                    key={note.id}
                    className="rounded px-3 py-2 text-sm text-gray-900"
                    style={{ backgroundColor: getNoteColor(note) }}
                  >
                    {note.message}
                  </p>
                ))
              )}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
