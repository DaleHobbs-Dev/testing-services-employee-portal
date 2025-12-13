import {
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

export const dashboardCards = [
  {
    id: "new-appointment",
    roles: ["admin", "proctor", "scheduler", "checkin", "technician"],
    title: "New Testing Appointment",
    description: "Schedule a new testing appointment for any student.",
    icon: <CalendarIcon className="w-8 h-8 text-primary" />,
    to: "/new-appointment",
  },
  {
    id: "daily-proctoring",
    roles: ["admin", "proctor", "scheduler"],
    title: "Daily Proctoring Dashboard",
    description: "View and manage today's testing center activity.",
    icon: <ClipboardDocumentCheckIcon className="w-8 h-8 text-primary" />,
    to: "/proctoring-dashboard",
  },
  {
    id: "employee-management",
    roles: ["admin"],
    title: "Employee Management",
    description: "Add, edit, or remove testing center employees.",
    icon: <UsersIcon className="w-8 h-8 text-primary" />,
    to: "/manage-employees",
  },
  {
    id: "employee-schedule-management",
    roles: ["admin", "scheduler"],
    title: "Employee Schedule Management",
    description: "Add, edit, or remove testing center employee schedules.",
    icon: <UsersIcon className="w-8 h-8 text-primary" />,
    to: "/employee-schedules",
  },
  {
    id: "exam-management",
    roles: ["admin"],
    title: "Exam Management",
    description: "Maintain exam offerings and configuration.",
    icon: <BookOpenIcon className="w-8 h-8 text-primary" />,
    to: "/exam-list",
  },
];
