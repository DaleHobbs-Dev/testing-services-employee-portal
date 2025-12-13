import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from "@/components/ui";

import AppointmentTable from "./AppointmentTable";

export default function AppointmentTableGroup({
  familyName, // ← pass this from parent
  appointments,
}) {
  return (
    <Card className="mb-10">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{familyName}</CardTitle>
        <Badge variant="primary">{appointments.length} appointments</Badge>
      </CardHeader>

      <CardContent>
        <AppointmentTable appointments={appointments} />
      </CardContent>
    </Card>
  );
}
