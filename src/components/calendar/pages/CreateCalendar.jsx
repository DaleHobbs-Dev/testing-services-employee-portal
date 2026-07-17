import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  FormField,
  Input,
  PageHeader,
  Section,
  Select,
} from "@/components";
import { useCurrentUser } from "@/context";
import { createCalendar, getAllEmployees } from "@/services";
import { employeeHasRole } from "@/utils/roleUtils";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";

const currentYear = new Date().getFullYear();

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const rangeOptions = {
  janMay: {
    label: "Jan-May",
    description: "January through May",
    startMonth: 1,
    endMonth: 5,
  },
  junJuly: {
    label: "Jun-July",
    description: "June through July",
    startMonth: 6,
    endMonth: 7,
  },
  augDec: {
    label: "Aug-Dec",
    description: "August through December",
    startMonth: 8,
    endMonth: 12,
  },
  custom: {
    label: "Custom month range",
    description: "Choose a start and end month in the same year",
  },
};

const getMonthLabel = (month) =>
  monthOptions.find((option) => option.value === Number(month))?.label || "";

const getCreatedCalendar = (response) => response?.calendar || response;

export function CreateCalendar() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const canChooseEmployee = employeeHasRole(currentUser, ["admin", "clerk"]);
  const [rangeType, setRangeType] = useState("janMay");
  const [year, setYear] = useState(String(currentYear));
  const [customStartMonth, setCustomStartMonth] = useState("1");
  const [customEndMonth, setCustomEndMonth] = useState("5");
  const [calendarName, setCalendarName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canChooseEmployee) return;

    setIsLoadingEmployees(true);
    getAllEmployees()
      .then((employeeData) => {
        setEmployees(employeeData);
        const currentEmployee = employeeData.find(
          (employee) => String(employee.id) === String(currentUser?.id)
        );

        setSelectedEmployeeId(
          String(currentEmployee?.id || employeeData[0]?.id || "")
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load employees for calendar assignment.");
      })
      .finally(() => {
        setIsLoadingEmployees(false);
      });
  }, [canChooseEmployee, currentUser?.id]);

  const selectedRange = useMemo(() => {
    if (rangeType !== "custom") {
      return rangeOptions[rangeType];
    }

    return {
      ...rangeOptions.custom,
      startMonth: Number(customStartMonth),
      endMonth: Number(customEndMonth),
    };
  }, [customEndMonth, customStartMonth, rangeType]);

  const generatedName = useMemo(() => {
    const rangeLabel =
      rangeType === "custom"
        ? `${getMonthLabel(selectedRange.startMonth)}-${getMonthLabel(
            selectedRange.endMonth
          )}`
        : rangeOptions[rangeType].label;

    return `${rangeLabel} ${year} Calendar`;
  }, [rangeType, selectedRange.endMonth, selectedRange.startMonth, year]);

  const selectedEmployee = useMemo(() => {
    if (!canChooseEmployee) return currentUser;

    return (
      employees.find(
        (employee) => String(employee.id) === String(selectedEmployeeId)
      ) || null
    );
  }, [canChooseEmployee, currentUser, employees, selectedEmployeeId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const numericYear = Number(year);
    if (!Number.isInteger(numericYear) || numericYear < 1900) {
      setError("Enter a valid starting year.");
      return;
    }

    if (selectedRange.endMonth < selectedRange.startMonth) {
      setError("The ending month must be the same as or after the starting month.");
      return;
    }

    if (canChooseEmployee && !selectedEmployeeId) {
      setError("Choose an employee for this calendar.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await createCalendar({
        name: calendarName.trim() || generatedName,
        year: numericYear,
        startMonth: selectedRange.startMonth,
        endMonth: selectedRange.endMonth,
        ...(canChooseEmployee && selectedEmployeeId
          ? { employeeId: selectedEmployeeId }
          : {}),
      });
      const createdCalendar = getCreatedCalendar(response);

      navigate("/calendar-management/edit", {
        state: {
          calendarId: createdCalendar?.id,
          startMonth: createdCalendar?.startMonth || selectedRange.startMonth,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Could not create this calendar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Section className="max-w-4xl mx-auto">
        <PageHeader
          title="Create Calendar"
          description="Choose a calendar range and starting year, then open it in the editor."
          center
        />

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        <Card>
          <CardHeader>
            <CardTitle>Calendar Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Calendar Name">
                  <Input
                    value={calendarName}
                    onChange={(event) => setCalendarName(event.target.value)}
                    placeholder={generatedName}
                  />
                </FormField>

                <FormField label="Starting Year">
                  <Input
                    type="number"
                    min="1900"
                    max="2200"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    required
                  />
                </FormField>
              </div>

              {canChooseEmployee && (
                <FormField label="Choose Employee">
                  <Select
                    value={selectedEmployeeId}
                    onChange={(event) =>
                      setSelectedEmployeeId(event.target.value)
                    }
                    disabled={isLoadingEmployees}
                    required
                  >
                    <option value="">
                      {isLoadingEmployees
                        ? "Loading employees..."
                        : "Select employee"}
                    </option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {getEmployeeDisplayName(employee)}
                      </option>
                    ))}
                  </Select>
                </FormField>
              )}

              <FormField label="Calendar Type">
                <Select
                  value={rangeType}
                  onChange={(event) => setRangeType(event.target.value)}
                >
                  {Object.entries(rangeOptions).map(([value, option]) => (
                    <option key={value} value={value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <p className="mt-2 text-sm text-adaptive-muted">
                  {selectedRange.description}
                </p>
              </FormField>

              {rangeType === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Starting Month">
                    <Select
                      value={customStartMonth}
                      onChange={(event) =>
                        setCustomStartMonth(event.target.value)
                      }
                    >
                      {monthOptions.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField label="Ending Month">
                    <Select
                      value={customEndMonth}
                      onChange={(event) => setCustomEndMonth(event.target.value)}
                    >
                      {monthOptions.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </div>
              )}

              <div className="rounded-lg border border-adaptive bg-muted p-4">
                <p className="text-sm font-semibold text-adaptive">
                  {calendarName.trim() || generatedName}
                </p>
                <p className="text-sm text-adaptive-muted">
                  {getMonthLabel(selectedRange.startMonth)} through{" "}
                  {getMonthLabel(selectedRange.endMonth)} {year}
                </p>
                {selectedEmployee && (
                  <p className="mt-2 text-xs font-medium text-adaptive">
                    Owner: {getEmployeeDisplayName(selectedEmployee)}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Creating..." : "Create and Edit Calendar"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  to="/calendar-management"
                >
                  Back to Calendar Menu
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
