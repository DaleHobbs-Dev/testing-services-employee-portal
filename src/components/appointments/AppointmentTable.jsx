import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui";
import AppointmentTableRow from "./AppointmentTableRow";

export default function AppointmentTable({ appointments }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Examinee</TableHead>
          <TableHead>Proctor</TableHead>
          <TableHead>Workstation</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {appointments.map((appt) => (
          <AppointmentTableRow key={appt.id} appointment={appt} />
        ))}
      </TableBody>
    </Table>
  );
}
