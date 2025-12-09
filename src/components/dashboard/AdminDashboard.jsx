import {
  Button,
  H1,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  PageHeader,
  Section,
  Container,
} from "@/components/ui";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

export default function AdminDashboard() {
  return (
    <Container>
      <Section className="max-w-5xl mx-auto px-1 py-1">
        <PageHeader
          title="Admin Dashboard"
          description="Administrator tools and management options."
          center
        />
        <Card className="p-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">
              Administration Menu
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* New Testing Appointment */}
            <Card className="p-8 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/new-testing-appointment"
                className="flex flex-col h-full"
              >
                <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
                  <CalendarIcon className="w-8 h-8 text-primary" />
                  <CardTitle className="m-auto">
                    New Testing Appointment
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Schedule a new testing appointment for any student.
                </p>
                <div className="mt-auto pt-4">
                  <Button className="hover-glow-purple">Open</Button>
                </div>
              </Link>
            </Card>

            {/* Daily Proctoring Dashboard */}
            <Card className="p-8 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/daily-proctoring-dashboard"
                className="flex flex-col h-full"
              >
                <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
                  <ClipboardDocumentCheckIcon className="w-8 h-8 text-primary" />
                  <CardTitle className="m-auto">
                    Daily Proctoring Dashboard
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  View and manage today’s testing center activity.
                </p>
                <div className="mt-auto pt-4">
                  <Button className="hover-glow-purple">Open</Button>
                </div>
              </Link>
            </Card>

            {/* Employee Management */}
            <Card className="p-8 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/employee-list"
                className="flex flex-col h-full"
              >
                <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
                  <UsersIcon className="w-8 h-8 text-primary" />
                  <CardTitle className="m-auto">Employee Management</CardTitle>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Add, edit, or remove testing center employees.
                </p>
                <div className="mt-auto pt-4">
                  <Button>Open</Button>
                </div>
              </Link>
            </Card>

            {/* Exam Management */}
            <Card className="p-8 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/exam-list"
                className="flex flex-col h-full"
              >
                <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
                  <BookOpenIcon className="w-8 h-8 text-primary" />
                  <CardTitle className="m-auto">Exam Management</CardTitle>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Maintain exam offerings and configuration.
                </p>
                <div className="mt-auto pt-4">
                  <Button>Open</Button>
                </div>
              </Link>
            </Card>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
