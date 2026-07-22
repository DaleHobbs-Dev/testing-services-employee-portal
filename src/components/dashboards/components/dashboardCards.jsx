// This file defines the configuration for dashboard cards, including their titles, descriptions, icons, and access roles.
// Each card object contains an id, roles array, title, description, icon component, and navigation path.
import {
  UsersIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";

export const dashboardCards = [
  {
    id: "exam-management",
    roles: ["admin", "technician"],
    title: "Exam Management",
    description: "Manage test types, test variants, and other exam settings.",
    icon: <AcademicCapIcon className="w-8 h-8 text-primary" />,
    to: "/exam-management",
  },
  {
    id: "notification-management",
    roles: ["admin", "technician"],
    title: "System Notifications",
    description: "Publish and manage release notifications for employees.",
    icon: <BellAlertIcon className="w-8 h-8 text-primary" />,
    to: "/notification-management",
  },
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
