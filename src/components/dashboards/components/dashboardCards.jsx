// This file defines the configuration for dashboard cards, including their titles, descriptions, icons, and access roles.
// Each card object contains an id, roles array, title, description, icon component, and navigation path.
import {
  UsersIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

export const dashboardCards = [
  {
    id: "employee-management",
    roles: ["admin", "technician"],
    title: "Employee Management",
    description: "Add, edit, or remove testing center employees.",
    icon: <UsersIcon className="w-8 h-8 text-primary" />,
    to: "/employee-management",
  },
  {
    id: "calendar-management",
    roles: [
      "admin",
      "proctor",
      "scheduler",
      "checkin",
      "technician",
      "frontdesk",
      "clerk",
    ],
    title: "Calendar Management",
    description: "View and edit testing center calendar schedules.",
    icon: <CalendarDaysIcon className="w-8 h-8 text-primary" />,
    to: "/calendar-management",
  },
];
