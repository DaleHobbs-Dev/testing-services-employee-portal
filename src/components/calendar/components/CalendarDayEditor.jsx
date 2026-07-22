import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Textarea,
} from "@/components";
import {
  DayNoteColorPicker,
  DEFAULT_DAY_NOTE_COLOR,
} from "@/components/calendar/components/DayNoteColorPicker";
import { ExistingDayEntries } from "@/components/calendar/components/ExistingDayEntries";
import {
  CLOSURE_TYPES,
  DEFAULT_CLOSURE_TYPE,
} from "@/components/calendar/utils/closureTypes";
import {
  buildMonthGrid,
  getMonthName,
  WEEKDAY_LABELS,
} from "@/components/calendar/utils/dateGrid";
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

const DEFAULT_EMPLOYEE_START_TIME = "07:45";
const DEFAULT_EMPLOYEE_END_TIME = "16:15";

const sortDates = (dates) => [...dates].sort();

const getDateParts = (date) => {
  const [year, month] = asString(date).split("-").map(Number);
  return { year, month };
};

const formatEditorDate = (date) => {
  if (!date) return "";

  const [year, month, day] = asString(date).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function BadgeDatePicker({
  title,
  isOpen,
  onClose,
  selectedDates,
  onToggleDate,
  year,
  month,
}) {
  const weeks = buildMonthGrid(year, month);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>
        <div>
          <h2 className="text-xl font-semibold text-adaptive">{title}</h2>
          <p className="text-sm text-adaptive-muted">
            {getMonthName(month)} {year}
          </p>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-adaptive">
          {WEEKDAY_LABELS.map((weekday) => (
            <div key={weekday} className="p-1">
              {weekday}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {weeks.flat().map((day) => {
            const isSelected = selectedDates.includes(day.date);

            return (
              <button
                key={day.key}
                type="button"
                disabled={!day.isCurrentMonth}
                onClick={() => onToggleDate(day.date)}
                className={`min-h-9 rounded border text-sm transition ${
                  day.isCurrentMonth
                    ? isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-adaptive bg-adaptive text-adaptive hover:border-primary"
                    : "border-transparent bg-transparent"
                }`}
              >
                {day.dayNumber}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-adaptive-muted">
          {selectedDates.length} date{selectedDates.length === 1 ? "" : "s"} selected
        </p>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export function CalendarDayEditor({
  date,
  locationId,
  monthView = {},
  locations = [],
  employees = [],
  testFamilies = [],
  onSave,
  onUpdateEntry,
  onDeleteEntry,
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
    closureType: existingClosure?.closureType || DEFAULT_CLOSURE_TYPE,
    closureReason: existingClosure?.reason || "",
    label: existingLabel?.label || "",
    showWhenClosed: existingLabel
      ? existingLabel.showWhenClosed !== false
      : true,
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
  const [testFamilyDates, setTestFamilyDates] = useState(() => [date]);
  const [employeeDates, setEmployeeDates] = useState(() => [date]);
  const [datePickerType, setDatePickerType] = useState(null);
  const { year: editorYear, month: editorMonth } = getDateParts(date);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => {
      const nextValue = type === "checkbox" ? checked : value;

      if (name === "isClosed" && checked) {
        return {
          ...prev,
          isClosed: true,
          closureType: prev.closureType || DEFAULT_CLOSURE_TYPE,
          testFamilyId: "",
          testFamilyStartTime: "",
          testFamilyEndTime: "",
          employeeId: "",
          employeeStartTime: DEFAULT_EMPLOYEE_START_TIME,
          employeeEndTime: DEFAULT_EMPLOYEE_END_TIME,
          employeeLabelType: "",
          employeeCustomLabel: "",
        };
      }

      return {
        ...prev,
        [name]: nextValue,
      };
    });
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

  const toggleSelectedDate = (type, selectedDate) => {
    const updateDates = (prev) =>
      prev.includes(selectedDate)
        ? prev.length === 1
          ? prev
          : sortDates(prev.filter((item) => item !== selectedDate))
        : sortDates([...prev, selectedDate]);

    if (type === "testFamily") {
      setTestFamilyDates(updateDates);
    } else {
      setEmployeeDates(updateDates);
    }
  };

  const getDateSummary = (dates) =>
    dates.length === 1 ? dates[0] : `${dates.length} dates selected`;

  const handleToggleClosed = () => {
    setFormData((prev) => {
      if (prev.isClosed) {
        return { ...prev, isClosed: false };
      }

      return {
        ...prev,
        isClosed: true,
        closureType: prev.closureType || DEFAULT_CLOSURE_TYPE,
        testFamilyId: "",
        testFamilyStartTime: "",
        testFamilyEndTime: "",
        employeeId: "",
        employeeStartTime: DEFAULT_EMPLOYEE_START_TIME,
        employeeEndTime: DEFAULT_EMPLOYEE_END_TIME,
        employeeLabelType: "",
        employeeCustomLabel: "",
      };
    });
  };

  const handleUpdateExistingEntry = async (entryType, entryId, entryData) => {
    await onUpdateEntry?.(entryType, entryId, entryData);
    if (entryType === "label") {
      setFormData((previous) => ({
        ...previous,
        label: entryData.label,
        showWhenClosed: entryData.showWhenClosed,
      }));
    }
  };

  const handleDeleteExistingEntry = async (entryType, entryId) => {
    await onDeleteEntry?.(entryType, entryId);
    if (entryType === "label") {
      setFormData((previous) => ({ ...previous, label: "" }));
    }
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
        formData.employeeStartTime)
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
      closureType: formData.closureType,
      closureReason: formData.closureReason,
      label: formData.label,
      showWhenClosed: formData.showWhenClosed,
      testFamilyBadge:
        !formData.isClosed &&
        formData.testFamilyId &&
        formData.testFamilyStartTime
          ? {
              testFamilyId: formData.testFamilyId,
              locationId,
              date,
              dates: testFamilyDates,
              startTime: formData.testFamilyStartTime,
              endTime: formData.testFamilyEndTime,
            }
          : null,
      employeeBadge: !formData.isClosed && newEmployeeBadge
        ? {
            ...newEmployeeBadge,
            locationId,
            date,
            dates: employeeDates,
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
        <CardTitle>Editing {formatEditorDate(date)}</CardTitle>
        <p className="text-sm text-adaptive-muted">
          {location?.name || "Selected location"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <section>
            <Button
              type="button"
              variant={formData.isClosed ? "danger" : "outline"}
              className="w-full"
              onClick={handleToggleClosed}
              aria-pressed={formData.isClosed}
              title="remove test types and schedules from the day"
            >
              {formData.isClosed
                ? "Testing Center Closed"
                : "Mark Testing Center Closed"}
            </Button>
            <div className="mt-4">
              <ExistingDayEntries
                testFamilyBadges={existingTestFamilyBadges}
                employeeBadges={existingEmployeeBadges}
                notes={existingNotes}
                label={existingLabel}
                testFamilies={testFamilies}
                employees={employees}
                onUpdateEntry={handleUpdateExistingEntry}
                onDeleteEntry={handleDeleteExistingEntry}
              />
            </div>
            {formData.isClosed && (
              <div className="mt-2 space-y-3">
                <FormField label="Closure Type">
                  <Select
                    name="closureType"
                    value={formData.closureType}
                    onChange={handleChange}
                  >
                    {CLOSURE_TYPES.map((closureType) => (
                      <option key={closureType.value} value={closureType.value}>
                        {closureType.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <Input
                  name="closureReason"
                  value={formData.closureReason}
                  onChange={handleChange}
                  placeholder="Closure reason"
                />
              </div>
            )}
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

          {!formData.isClosed && (
            <>
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
                <div className="mt-4 rounded-md border border-adaptive bg-adaptive p-3">
                  <p className="text-sm font-medium text-adaptive">
                    Apply to
                  </p>
                  <p className="text-sm text-adaptive-muted">
                    {getDateSummary(testFamilyDates)}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3"
                    onClick={() => setDatePickerType("testFamily")}
                  >
                    Choose Dates
                  </Button>
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
                <div className="mt-4 rounded-md border border-adaptive bg-adaptive p-3">
                  <p className="text-sm font-medium text-adaptive">
                    Apply to
                  </p>
                  <p className="text-sm text-adaptive-muted">
                    {getDateSummary(employeeDates)}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3"
                    onClick={() => setDatePickerType("employee")}
                  >
                    Choose Dates
                  </Button>
                </div>
              </section>
            </>
          )}

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

          <Button type="button" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Day"}
          </Button>
        </div>
      </CardContent>
      <BadgeDatePicker
        title="Choose Test Type Dates"
        isOpen={datePickerType === "testFamily"}
        onClose={() => setDatePickerType(null)}
        selectedDates={testFamilyDates}
        onToggleDate={(selectedDate) =>
          toggleSelectedDate("testFamily", selectedDate)
        }
        year={editorYear}
        month={editorMonth}
      />
      <BadgeDatePicker
        title="Choose Employee Schedule Dates"
        isOpen={datePickerType === "employee"}
        onClose={() => setDatePickerType(null)}
        selectedDates={employeeDates}
        onToggleDate={(selectedDate) => toggleSelectedDate("employee", selectedDate)}
        year={editorYear}
        month={editorMonth}
      />
    </Card>
  );
}
