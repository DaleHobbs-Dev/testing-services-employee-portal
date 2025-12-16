import { TableRow, TableCell, Badge } from "@/components/ui";

// Component to display a single appointment row in the table
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
          <div className="text-sm">
            <span className="font-medium text-gray-700">
              {appointment.variantCount} subtests:
            </span>
            <span className="italic text-gray-600 ml-1">
              {appointment.variantTitles.join(", ")}
            </span>
          </div>
        ) : (
          <span className="text-gray-600">{appointment.note}</span>
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
