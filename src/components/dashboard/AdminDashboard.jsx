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

export default function AdminDashboard() {
  return (
    <Container>
      <Section className="max-w-xl mx-auto">
        {" "}
        {/* centers it nicely */}
        <PageHeader className="text-center">
          <H1>Admin Dashboard</H1>
        </PageHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">
              Administration Menu
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Testing Appointment */}
            <Card className="p-4 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/new-testing-appointment"
                className="flex flex-col h-full"
              >
                <CardTitle>New Testing Appointment</CardTitle>
                <p className="text-sm text-gray-600 mb-3">
                  Schedule a new testing appointment for any student.
                </p>
                <div className="mt-auto pt-4">
                  <Button className="hover-glow-purple">Open</Button>
                </div>
              </Link>
            </Card>

            {/* Daily Proctoring Dashboard */}
            <Card className="p-4 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/daily-proctoring-dashboard"
                className="flex flex-col h-full"
              >
                <CardTitle>Daily Proctoring Dashboard</CardTitle>
                <p className="text-sm text-gray-600 mb-3">
                  View and manage today’s testing center activity.
                </p>
                <div className="mt-auto pt-4">
                  <Button className="hover-glow-purple">Open</Button>
                </div>
              </Link>
            </Card>

            {/* Employee Management */}
            <Card className="p-4 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/employee-list"
                className="flex flex-col h-full"
              >
                <CardTitle>Employee Management</CardTitle>
                <p className="text-sm text-gray-600 mb-3">
                  Add, edit, or remove testing center employees.
                </p>
                <div className="mt-auto pt-4">
                  <Button>Open</Button>
                </div>
              </Link>
            </Card>

            {/* Exam Management */}
            <Card className="p-4 flex flex-col h-full transition-transform hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1 cursor-pointer">
              <Link
                to="/admin-dashboard/exam-list"
                className="flex flex-col h-full"
              >
                <CardTitle>Exam Management</CardTitle>
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
