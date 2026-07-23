import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Container, PageHeader, Section } from "@/components";
import { useCurrentUser } from "@/context";
import { getAllEmployees, getAllTestFamilies, updateEmployeeBadgeColor, updateTestFamily } from "@/services";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";
import { employeeHasRole } from "@/utils/roleUtils";
import {
  filterActiveEmployees,
  filterActiveTestFamilies,
} from "@/components/calendar/utils/activeSelections";

const DEFAULT_COLOR = "#64748B";
const HEX_COLOR = /^#[0-9A-F]{6}$/i;
const errorMessage = (error, fallback) => error?.body?.message || error?.body?.error || fallback;

function ColorRow({ item, label, collection, onSave, busy }) {
  const [color, setColor] = useState(item.badgeColor || DEFAULT_COLOR);
  const duplicate = collection.some((other) => other.id !== item.id && other.badgeColor?.toUpperCase() === color.toUpperCase());
  const changed = color.toUpperCase() !== (item.badgeColor || "").toUpperCase();

  return (
    <div className="flex flex-col gap-3 border-b border-adaptive py-4 last:border-0 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-adaptive-muted">{item.badgeColor || "No color assigned"}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value.toUpperCase())} aria-label={`Color for ${label}`} className="h-10 w-14 cursor-pointer rounded border border-adaptive bg-transparent p-1" />
        <input value={color} maxLength={7} onChange={(e) => setColor(e.target.value.toUpperCase())} aria-label={`Hex color for ${label}`} className="w-28 rounded-md border border-gray-300 bg-adaptive p-2 text-adaptive dark:border-gray-600" />
        <Button onClick={() => onSave(item, color)} disabled={busy || !changed || !HEX_COLOR.test(color) || duplicate}>{busy ? "Saving..." : "Save"}</Button>
        {item.badgeColor && <Button variant="secondary" onClick={() => onSave(item, null)} disabled={busy}>Clear</Button>}
      </div>
      {duplicate && <p className="text-sm text-red-600">That color is already in use.</p>}
    </div>
  );
}

export function CalendarBadgeColors() {
  const { currentUser } = useCurrentUser();
  const isAdmin = employeeHasRole(currentUser, "admin");
  const [families, setFamilies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [busy, setBusy] = useState(null);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    try {
      const [familyData, employeeData] = await Promise.all([getAllTestFamilies(), getAllEmployees()]);
      setFamilies(filterActiveTestFamilies(familyData));
      setEmployees(filterActiveEmployees(employeeData));
    } catch (error) {
      setMessage({ type: "error", text: errorMessage(error, "Unable to load calendar badge colors.") });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (kind, item, badgeColor) => {
    setBusy(`${kind}-${item.id}`);
    setMessage(null);
    try {
      if (kind === "family") await updateTestFamily(item.id, { badgeColor });
      else await updateEmployeeBadgeColor(item.id, badgeColor);
      setMessage({ type: "success", text: `${kind === "family" ? "Test type" : "Employee"} color updated.` });
      await load();
    } catch (error) {
      setMessage({ type: "error", text: errorMessage(error, "Unable to update the badge color.") });
    } finally { setBusy(null); }
  };

  return (
    <Container>
      <Section className="max-w-5xl mx-auto">
        <PageHeader title="Calendar Badge Colors" description="Choose the colors used to identify test types and employees on calendars." center />
        {message && <Alert variant={message.type} className="mb-6">{message.text}</Alert>}
        {isAdmin && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Test Type Colors</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-adaptive-muted">Colors must be unique among active Test Types.</p>
              {families.map((family) => <ColorRow key={`${family.id}-${family.badgeColor}`} item={family} label={family.name || family.label || "Test Type"} collection={families} busy={busy === `family-${family.id}`} onSave={(item, color) => save("family", item, color)} />)}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle>Employee Colors</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-adaptive-muted">Employee colors are unique separately from Test Type colors.</p>
            {employees.map((employee) => <ColorRow key={`${employee.id}-${employee.badgeColor}`} item={employee} label={getEmployeeDisplayName(employee)} collection={employees} busy={busy === `employee-${employee.id}`} onSave={(item, color) => save("employee", item, color)} />)}
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
