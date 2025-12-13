import { TableRow, TableCell, Badge } from "@/components/ui";

export default function AppointmentTableRow({ appointment }) {
  return (
    <TableRow>
      <TableCell>
        {formatTimeRange(appointment.startTime, appointment.endTime)}
      </TableCell>
      <TableCell>{appointment.examineeName}</TableCell>
      <TableCell>{appointment.proctorName}</TableCell>
      <TableCell>{appointment.workstationLabel}</TableCell>
      <TableCell>
        <Badge
          variant={appointment.status === "checked-in" ? "success" : "warning"}
        >
          {appointment.status}
        </Badge>
      </TableCell>
      <TableCell>
        {appointment.variantCount > 1 ? (
          <span className="italic text-gray-600">
            Multiple tests ({appointment.variantCount})
          </span>
        ) : (
          appointment.note
        )}
      </TableCell>
    </TableRow>
  );
}

function formatTimeRange(start, end) {
  const s = new Date(start).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const e = new Date(end).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${s}–${e}`;
}
