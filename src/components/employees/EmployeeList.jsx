import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  PageHeader,
  Section,
  Container,
  Badge,
} from "@/components/ui";
import { Link } from "react-router-dom";
import { getAllEmployees } from "@/services";
import EmployeeDetails from "./EmployeeDetails";
import { UserIcon } from "@heroicons/react/24/outline";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    getAllEmployees().then(setEmployees);
  }, []);

  const openDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <Container>
      <Section className="max-w-6xl mx-auto">
        <PageHeader
          title="Employee Management"
          description="View and manage all testing center employees."
          center
        />

        <div className="flex justify-end mb-6">
          <Link to="/admin-dashboard/employee-list/new">
            <Button variant="accent" className="focus-ring">
              Add New Employee
            </Button>
          </Link>
        </div>

        <Grid cols={3}>
          {employees.map((emp) => (
            <Card
              key={emp.id}
              className="p-4 shadow-sm hover:shadow-md transition cursor-pointer group"
              onClick={() => openDetails(emp)}
            >
              <CardHeader className="flex items-center mb-3 p-2 rounded-lg bg-primary-light/30 text-primary">
                <div className="bg-purple-100 p-2 rounded-full shrink-0">
                  <UserIcon className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle className="text-lg flex-1 text-center font-semibold">
                  {emp.name}
                </CardTitle>
                <div className="w-10 shrink-0" /> {/* Spacer for balance */}
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Role:</span>{" "}
                  <Badge size="lg" variant={emp.role}>
                    {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                  </Badge>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {emp.email}
                </p>

                {/* Status Badge */}
                <div className="mt-3">
                  <Badge
                    size="xl"
                    variant={emp.status === "active" ? "success" : emp.status}
                  >
                    {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                  </Badge>
                </div>

                {/* Edit Button */}
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/admin-dashboard/employee-list/edit/${emp.id}`}
                    onClick={(e) => e.stopPropagation()} // Prevents modal from opening
                  >
                    <Button variant="primary" className="focus-ring">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>
      {/* Employee Details Modal */}
      <EmployeeDetails
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </Container>
  );
}
