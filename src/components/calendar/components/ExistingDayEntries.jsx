import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  DayNoteColorPicker,
  DEFAULT_DAY_NOTE_COLOR,
} from "@/components/calendar/components/DayNoteColorPicker";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";
import { formatOptionalTimeRange } from "@/components/calendar/utils/timeRange";

const asString = (value) =>
  value === undefined || value === null ? "" : String(value);

export function ExistingDayEntries({
  testFamilyBadges = [],
  employeeBadges = [],
  notes = [],
  label = null,
  testFamilies = [],
  employees = [],
  onUpdateEntry,
  onDeleteEntry,
}) {
  const [isManaging, setIsManaging] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [editData, setEditData] = useState({});

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
    return getEmployeeDisplayName(employee) || "Employee";
  };

  const entries = [
    ...(label ? [{ type: "label", badge: label }] : []),
    ...testFamilyBadges.map((badge) => ({ type: "testFamily", badge })),
    ...employeeBadges.map((badge) => ({ type: "employee", badge })),
    ...notes.map((note) => ({ type: "note", badge: note })),
  ];

  const getEntryLabel = ({ type, badge }) => {
    if (type === "label") return `Label: ${badge.label}`;
    if (type === "note") return badge.message || "Note";
    return type === "testFamily"
      ? `${getTestFamilyName(badge)} ${formatOptionalTimeRange(
          badge.startTime,
          badge.endTime
        )}`
      : `${getEmployeeName(badge)} ${
          badge.customLabel ||
          formatOptionalTimeRange(badge.startTime, badge.endTime)
        }`;
  };

  const openEdit = (entry) => {
    setEditingEntry(entry);
    setEditData(
      entry.type === "label"
        ? {
            label: entry.badge.label || "",
            showWhenClosed: entry.badge.showWhenClosed !== false,
          }
        : entry.type === "note"
        ? {
            message: entry.badge.message || "",
            color: entry.badge.colorHex || entry.badge.color || DEFAULT_DAY_NOTE_COLOR,
          }
        : entry.type === "testFamily"
        ? {
            testFamilyId: asString(entry.badge.testFamilyId),
            startTime: entry.badge.startTime || "",
            endTime: entry.badge.endTime || "",
          }
        : {
            employeeId: asString(entry.badge.employeeId),
            startTime: entry.badge.startTime || "",
            endTime: entry.badge.endTime || "",
            customLabel: entry.badge.customLabel || "",
          }
    );
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editingEntry) return;

    setIsWorking(true);
    try {
      await onUpdateEntry?.(editingEntry.type, editingEntry.badge.id, editData);
      setEditingEntry(null);
    } finally {
      setIsWorking(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingEntry) return;

    setIsWorking(true);
    try {
      await onDeleteEntry?.(deletingEntry.type, deletingEntry.badge.id);
      setDeletingEntry(null);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <section className="rounded-lg border border-adaptive bg-muted p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-adaptive">Existing Entries</h3>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={() => setIsManaging((previous) => !previous)}
            className="rounded-md p-1.5 text-adaptive-muted transition hover:bg-adaptive hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={isManaging ? "Finish editing entries" : "Edit existing entries"}
            title={isManaging ? "Finish editing entries" : "Edit existing entries"}
          >
            {isManaging ? (
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {entries.length > 0 ? (
        <div className={isManaging ? "mt-3 space-y-2" : "mt-2 flex flex-wrap gap-2"}>
          {entries.map((entry) => (
            <div
              key={`${entry.type}-${entry.badge.id}`}
              className={
                isManaging
                  ? "flex items-center justify-between gap-3 rounded-md border border-adaptive bg-adaptive px-3 py-2"
                  : `rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      entry.type === "testFamily"
                        ? "bg-primary-lighter text-primary-dark"
                      : entry.type === "employee"
                          ? "bg-accent-lighter text-accent-dark"
                          : entry.type === "label"
                            ? "bg-gray-200 text-gray-800"
                          : "text-gray-900"
                    }`
              }
              style={
                !isManaging && entry.type === "note"
                  ? {
                      backgroundColor:
                        entry.badge.colorHex ||
                        entry.badge.color ||
                        DEFAULT_DAY_NOTE_COLOR,
                    }
                  : undefined
              }
            >
              <span className={isManaging ? "min-w-0 flex-1 text-sm text-adaptive" : ""}>
                {getEntryLabel(entry)}
              </span>
              {isManaging && (
                <span className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(entry)}
                    className="rounded p-1.5 text-primary hover:bg-primary-lighter"
                    aria-label={`Edit ${getEntryLabel(entry)}`}
                    title="Edit entry"
                  >
                    <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingEntry(entry)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                    aria-label={`Delete ${getEntryLabel(entry)}`}
                    title="Delete entry"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-adaptive-muted">
          No test types or employee schedules yet.
        </p>
      )}

      <Modal isOpen={Boolean(editingEntry)} onClose={() => !isWorking && setEditingEntry(null)}>
        <form onSubmit={handleSave}>
          <ModalHeader onClose={() => !isWorking && setEditingEntry(null)}>
            <h2 className="text-xl font-semibold text-adaptive">Edit Entry</h2>
          </ModalHeader>
          <ModalBody className="space-y-4">
            {editingEntry?.type === "label" ? (
              <>
                <FormField label="Custom Label">
                  <Input
                    value={editData.label || ""}
                    onChange={(event) =>
                      setEditData((previous) => ({
                        ...previous,
                        label: event.target.value,
                      }))
                    }
                    required
                  />
                </FormField>
                <label className="flex items-center gap-2 text-sm text-adaptive">
                  <input
                    type="checkbox"
                    checked={editData.showWhenClosed !== false}
                    onChange={(event) =>
                      setEditData((previous) => ({
                        ...previous,
                        showWhenClosed: event.target.checked,
                      }))
                    }
                  />
                  Show label when closed
                </label>
              </>
            ) : editingEntry?.type === "note" ? (
              <>
                <FormField label="Message">
                  <Textarea
                    value={editData.message || ""}
                    onChange={(event) =>
                      setEditData((previous) => ({
                        ...previous,
                        message: event.target.value,
                      }))
                    }
                    required
                  />
                </FormField>
                <FormField label="Note Color">
                  <DayNoteColorPicker
                    value={editData.color || DEFAULT_DAY_NOTE_COLOR}
                    onChange={(color) =>
                      setEditData((previous) => ({ ...previous, color }))
                    }
                  />
                </FormField>
              </>
            ) : editingEntry?.type === "testFamily" ? (
              <FormField label="Test Type">
                <Select
                  value={editData.testFamilyId || ""}
                  onChange={(event) =>
                    setEditData((previous) => ({ ...previous, testFamilyId: event.target.value }))
                  }
                  required
                >
                  {testFamilies.map((testFamily) => (
                    <option key={testFamily.id} value={testFamily.id}>
                      {testFamily.name || testFamily.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : (
              <>
                <FormField label="Employee">
                  <Select
                    value={editData.employeeId || ""}
                    onChange={(event) =>
                      setEditData((previous) => ({ ...previous, employeeId: event.target.value }))
                    }
                    required
                  >
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {getEmployeeDisplayName(employee)}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Custom Label">
                  <Input
                    value={editData.customLabel || ""}
                    onChange={(event) =>
                      setEditData((previous) => ({ ...previous, customLabel: event.target.value }))
                    }
                    placeholder="Leave blank to use times"
                  />
                </FormField>
              </>
            )}
            {editingEntry?.type !== "note" && editingEntry?.type !== "label" && (
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Start Time">
                  <Input
                    type="time"
                    value={editData.startTime || ""}
                    onChange={(event) =>
                      setEditData((previous) => ({ ...previous, startTime: event.target.value }))
                    }
                    disabled={Boolean(editData.customLabel)}
                    required={!editData.customLabel}
                  />
                </FormField>
                <FormField label="End Time">
                  <Input
                    type="time"
                    value={editData.endTime || ""}
                    onChange={(event) =>
                      setEditData((previous) => ({ ...previous, endTime: event.target.value }))
                    }
                    disabled={Boolean(editData.customLabel)}
                  />
                </FormField>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="ghost" onClick={() => setEditingEntry(null)} disabled={isWorking}>
              Cancel
            </Button>
            <Button type="submit" disabled={isWorking}>
              {isWorking ? "Saving..." : "Save Changes"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <DeleteConfirmationModal
        isOpen={Boolean(deletingEntry)}
        onClose={() => !isWorking && setDeletingEntry(null)}
        onConfirm={handleDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this calendar entry?"
        warning={null}
        isDeleting={isWorking}
      />
    </section>
  );
}
