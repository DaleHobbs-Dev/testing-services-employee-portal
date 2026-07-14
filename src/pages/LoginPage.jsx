import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import { login } from "@/services";
import { TOKEN_KEY } from "@/services/apiSettings";
import {
  Container,
  PageHeader,
  Card,
  FormField,
  Input,
  Button,
  Alert,
} from "@/components";

export function LoginPage() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (loginEvent) => {
    loginEvent.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      const { employee, token } = await login({
        email: userEmail,
        password,
      });

      if (!employee || !token) {
        setError("Login failed: missing employee or token from server.");
        return;
      }

      setCurrentUser(employee);
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ token }));
      navigate("/employee-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.status === 401
          ? "Invalid email or password."
          : "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-20 max-w-lg">
      <div className="mt-6">
        <Card className="p-6">
          <PageHeader
            title="Employee Login"
            description="Please enter your email to log in."
            className="center-text"
            center
          />
          {error && (
            <Alert variant="error" className="mb-4">
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
            <FormField label="Password">
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
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
          <div className="mt-4 text-center text-sm text-adaptive-muted">
            Need an account?{" "}
            <Button to="/register" variant="ghost" className="px-1 py-0">
              Register
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
