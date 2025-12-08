import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../context/CurrentUserContext.js";
import { getEmployeeByEmail } from "../../services/employeeService.js";
import {
  Container,
  PageHeader,
  Card,
  FormField,
  Input,
  Button,
  Alert,
} from "@/components/ui";
import { PostItNote } from "../postit/PostItNote.jsx";

export default function Login() {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (loginEvent) => {
    loginEvent.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      const employees = await getEmployeeByEmail(userEmail);
      if (employees.length === 1) {
        const employee = employees[0];
        setCurrentUser(employee);
        localStorage.setItem(
          "testing_services_user",
          JSON.stringify({ id: employee.id })
        );
        // Navigate based on role
        if (employee.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Login failed: Employee not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-20 max-w-4xl">
      <div className="flex gap-6 mt-6">
        <Card className="p-6 flex-shrink-0">
          <PostItNote />
        </Card>
        <Card className="p-6 flex-1">
          <PageHeader
            title="Employee Login"
            description="Please enter your email to log in."
            className="center-text"
          />
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <FormField label="Email Address">
              <Input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </FormField>
            <Button
              type="submit"
              variant="primary"
              className="mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
