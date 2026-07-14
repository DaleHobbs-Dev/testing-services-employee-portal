import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  AppointmentTable
} from "@/components";

// Component to display a group of appointments under a test family
export function AppointmentTableGroup({ familyName, appointments }) {
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
