import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Container, DeleteConfirmationModal, FormField, Input, PageHeader, Section } from "@/components";
import { useCurrentUser } from "@/context";
import { createTestFamily, deleteTestFamily, getAllTestFamilies, updateTestFamily } from "@/services";
import { employeeHasRole } from "@/utils/roleUtils";

const emptyForm = {
  name: "",
  description: "",
  requiresVariantSelection: true,
  allowsMultipleVariants: false,
};
const errorMessage = (error, fallback) => error?.body?.message || error?.body?.error || fallback;

export function TestTypeManagement() {
  const { currentUser } = useCurrentUser();
  const isAdmin = employeeHasRole(currentUser, "admin");
  const isTechnician = employeeHasRole(currentUser, "technician");
  const [families, setFamilies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [familyToDeactivate, setFamilyToDeactivate] = useState(null);
  const formCardRef = useRef(null);

  const loadFamilies = useCallback(async () => {
    setLoading(true);
    try {
      setFamilies(await getAllTestFamilies());
    } catch (error) {
      setMessage({ type: "error", text: errorMessage(error, "Unable to load test types.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFamilies(); }, [loadFamilies]);

  const resetForm = () => { setEditingId(null); setForm(emptyForm); };
  const startEditing = (family) => {
    setEditingId(family.id);
    setForm({
      name: family.name || "",
      description: family.description || "",
      requiresVariantSelection: family.requiresVariantSelection ?? true,
      allowsMultipleVariants: family.allowsMultipleVariants ?? false,
    });
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusyId(editingId || "new");
    setMessage(null);
    try {
      if (editingId) await updateTestFamily(editingId, form);
      else await createTestFamily({ ...form, active: true });
      setMessage({ type: "success", text: `Test type ${editingId ? "updated" : "created"}.` });
      resetForm();
      await loadFamilies();
    } catch (error) {
      setMessage({ type: "error", text: errorMessage(error, "Unable to save the test type.") });
    } finally { setBusyId(null); }
  };

  const deactivate = async (family) => {
    setBusyId(family.id);
    setMessage(null);
    try {
      await deleteTestFamily(family.id);
      setMessage({ type: "success", text: `${family.name} was deactivated. Its calendar color was released.` });
      await loadFamilies();
    } catch (error) {
      setMessage({ type: "error", text: errorMessage(error, "Unable to deactivate the test type.") });
    } finally {
      setBusyId(null);
      setFamilyToDeactivate(null);
    }
  };

  const reactivate = async (family) => {
    setBusyId(family.id);
    setMessage(null);
    try {
      await updateTestFamily(family.id, { active: true });
      setMessage({ type: "success", text: `${family.name} was reactivated. Assign a new calendar color if needed.` });
      await loadFamilies();
    } catch (error) {
      setMessage({ type: "error", text: errorMessage(error, "Unable to reactivate the test type.") });
    } finally { setBusyId(null); }
  };

  const active = families.filter((family) => family.active !== false);
  const inactive = families.filter((family) => family.active === false);

  return (
    <Container>
      <Section className="max-w-5xl mx-auto">
        <PageHeader title="Test Type Management" description="Add a new Test Type, edit an existing Test Type, or deactivate a Test Type." center />
        {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}

        {isAdmin && (
          <Card ref={formCardRef} className="mb-6 scroll-mt-6">
            <CardHeader><CardTitle>{editingId ? "Edit Test Type" : "Add Test Type"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <FormField label="Name"><Input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
                <FormField label="Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.requiresVariantSelection} onChange={(e) => setForm({ ...form, requiresVariantSelection: e.target.checked })} />
                  Requires a test variant when scheduling
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.allowsMultipleVariants} onChange={(e) => setForm({ ...form, allowsMultipleVariants: e.target.checked })} />
                  Allows multiple variants in one session
                </label>
                <div className="flex gap-2">
                  <Button type="submit" disabled={busyId === (editingId || "new")}>{busyId ? "Saving..." : "Save Test Type"}</Button>
                  {editingId && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader><CardTitle>Active Test Types</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p>Loading test types...</p> : active.length === 0 ? <p>No active test types.</p> : active.map((family) => (
              <div key={family.id} className="flex flex-col gap-3 border-b border-adaptive py-4 last:border-0 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1"><p className="font-semibold">{family.name}</p><p className="text-sm text-adaptive-muted">{family.description || "No description"}</p></div>
                {isAdmin && <div className="flex gap-2"><Button variant="outline" onClick={() => startEditing(family)}>Edit</Button><Button variant="danger" disabled={busyId === family.id} onClick={() => setFamilyToDeactivate(family)}>Deactivate</Button></div>}
              </div>
            ))}
          </CardContent>
        </Card>

        {isTechnician && (
          <Card>
            <CardHeader><CardTitle>Reactivating Test Types</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-adaptive-muted">Restore a previously deactivated Test Type. Restored types return without a calendar badge color.</p>
              {inactive.length === 0 ? <p>No inactive test types.</p> : inactive.map((family) => (
                <div key={family.id} className="flex items-center justify-between gap-4 border-b border-adaptive py-4 last:border-0">
                  <span className="font-semibold">{family.name}</span>
                  <Button disabled={busyId === family.id} onClick={() => reactivate(family)}>{busyId === family.id ? "Restoring..." : "Reactivate"}</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <DeleteConfirmationModal
          isOpen={Boolean(familyToDeactivate)}
          onClose={() => setFamilyToDeactivate(null)}
          onConfirm={() => deactivate(familyToDeactivate)}
          title="Deactivate Test Type"
          message="Are you sure you want to deactivate this Test Type?"
          itemName={familyToDeactivate?.name}
          warning="Only a user with the TECHNICIAN role can reactivate this Test Type. Deactivation also releases its calendar badge color."
          isDeleting={busyId === familyToDeactivate?.id}
          confirmLabel="Deactivate"
          workingLabel="Deactivating..."
        />
      </Section>
    </Container>
  );
}
