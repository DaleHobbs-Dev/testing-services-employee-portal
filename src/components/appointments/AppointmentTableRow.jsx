import { TableRow, TableCell, Badge } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { formatTimeRange } from "@/utils";

export default function AppointmentTableRow({ appointment }) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/appointment-details/${appointment.id}`);
  };

  return (
    <TableRow
      className="hover:bg-purple-50 cursor-pointer"
      onClick={handleRowClick}
    >
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
