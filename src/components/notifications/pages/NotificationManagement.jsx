import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  DeleteConfirmationModal,
  FormField,
  Input,
  PageHeader,
  Section,
  Select,
  Spinner,
  Textarea,
} from "@/components";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  updateNotification,
} from "@/services";
import { EMPLOYEE_ROLES, formatRole, toApiRole } from "@/utils/roleUtils";

const CATEGORIES = ["ADDED", "CHANGED", "DEPRECATED", "REMOVED", "FIXED", "SECURITY"];
const TARGET_ROLES = EMPLOYEE_ROLES.filter((role) => role !== "unassigned");
const emptyForm = {
  version: "",
  title: "",
  message: "",
  category: "",
  targetRoles: [],
  isActive: true,
};

const getErrorMessage = (error, fallback) =>
  error?.body?.message || error?.body?.error || fallback;

const formatCategory = (category) =>
  category ? category.charAt(0) + category.slice(1).toLowerCase() : "General";

export function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getAllNotifications()
      .then(setNotifications)
      .catch((loadError) => {
        console.error(loadError);
        setError(getErrorMessage(loadError, "Unable to load notifications."));
      })
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
  };

  const startEditing = (notification) => {
    setEditingId(notification.id);
    setFormData({
      version: notification.version || "",
      title: notification.title || "",
      message: notification.message || "",
      category: notification.category || "",
      targetRoles: notification.targetRoles || [],
      isActive: notification.isActive !== false,
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleRole = (role) => {
    const apiRole = toApiRole(role);
    setFormData((current) => ({
      ...current,
      targetRoles: current.targetRoles.includes(apiRole)
        ? current.targetRoles.filter((item) => item !== apiRole)
        : [...current.targetRoles, apiRole],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      targetRoles: formData.targetRoles,
    };
    if (formData.version.trim()) payload.version = formData.version.trim();
    if (formData.category) payload.category = formData.category;
    if (editingId) payload.isActive = formData.isActive;

    try {
      if (editingId) {
        const updated = await updateNotification(editingId, payload);
        setNotifications((items) =>
          items.map((item) => (item.id === editingId ? updated : item))
        );
        setSuccess("Notification updated.");
      } else {
        const created = await createNotification(payload);
        setNotifications((items) => [created, ...items]);
        setSuccess("Notification created. Targeted employees will see it on their dashboard.");
      }
      setFormData(emptyForm);
      setEditingId(null);
    } catch (saveError) {
      console.error(saveError);
      setError(getErrorMessage(saveError, "Unable to save the notification."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");

    try {
      await deleteNotification(deleteTarget.id);
      setNotifications((items) => items.filter((item) => item.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) resetForm();
      setSuccess("Notification permanently deleted.");
      setDeleteTarget(null);
    } catch (deleteError) {
      console.error(deleteError);
      setError(getErrorMessage(deleteError, "Unable to delete the notification."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container>
      <Section className="max-w-5xl mx-auto">
        <PageHeader
          title="System Notifications"
          description="Publish release messages to all employees or selected roles."
          center
        />

        {error && <Alert variant="error" className="mb-4" role="alert">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4" role="status">{success}</Alert>}

        <Card className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-primary-dark">
            {editingId ? "Edit notification" : "Create notification"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Title">
                <Input
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  required
                />
              </FormField>
              <FormField label="Version (optional)">
                <Input
                  value={formData.version}
                  onChange={(event) => setFormData({ ...formData, version: event.target.value })}
                  placeholder="1.2.0"
                />
              </FormField>
            </div>

            <FormField label="Category (optional)">
              <Select
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
              >
                <option value="">General</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{formatCategory(category)}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Message">
              <Textarea
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                required
              />
            </FormField>

            <fieldset className="mb-4">
              <legend className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Target roles
              </legend>
              <p className="mb-2 text-sm text-adaptive-muted">
                Leave every role unchecked to show the notification to all employees.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {TARGET_ROLES.map((role) => (
                  <label key={role} className="flex items-center gap-2 rounded border border-adaptive px-3 py-2 text-adaptive">
                    <input
                      type="checkbox"
                      checked={formData.targetRoles.includes(toApiRole(role))}
                      onChange={() => toggleRole(role)}
                    />
                    {formatRole(role)}
                  </label>
                ))}
              </div>
            </fieldset>

            {editingId && (
              <label className="mb-5 flex items-center gap-2 text-adaptive">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                />
                Active and visible to employees who have not dismissed it
              </label>
            )}

            <div className="flex justify-end gap-3">
              {editingId && <Button type="button" variant="secondary" onClick={resetForm} disabled={saving}>Cancel edit</Button>}
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Publish notification"}
              </Button>
            </div>
          </form>
        </Card>

        <h2 className="mb-4 text-xl font-semibold text-primary-dark">Notification history</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner size="lg" /></div>
        ) : notifications.length === 0 ? (
          <Card><p className="text-adaptive-muted">No notifications have been created.</p></Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-adaptive">{notification.title}</h3>
                      <Badge variant={notification.isActive ? "success" : "inactive"}>
                        {notification.isActive ? "Active" : "Retired"}
                      </Badge>
                      {notification.category && <Badge>{formatCategory(notification.category)}</Badge>}
                    </div>
                    {notification.version && <p className="text-sm font-medium text-adaptive-muted">Version {notification.version}</p>}
                    <p className="mt-2 whitespace-pre-wrap text-adaptive">{notification.message}</p>
                    <p className="mt-3 text-sm text-adaptive-muted">
                      Audience: {notification.targetRoles?.length
                        ? notification.targetRoles.map(formatRole).join(", ")
                        : "All employees"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" onClick={() => startEditing(notification)}>Edit</Button>
                    <Button type="button" variant="danger" onClick={() => setDeleteTarget(notification)}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete notification"
        message="This permanently deletes the notification and all employee dismissal records."
        itemName={deleteTarget?.title}
        warning="Retire the notification instead if you want to preserve its history."
        isDeleting={deleting}
      />
    </Container>
  );
}
