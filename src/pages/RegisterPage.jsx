import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Container,
  FormField,
  Input,
  PageHeader,
} from "@/components";
import { register } from "@/services";

const passwordRules = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least one capital letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "At least one number",
    test: (value) => /\d/.test(value),
  },
  {
    id: "special",
    label: "At least one special character",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

function RequirementIndicator({ met, children }) {
  return (
    <div
      className={`flex items-center justify-between rounded border px-3 py-2 text-sm ${
        met
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <span>{children}</span>
      <span className="font-semibold">{met ? "Met" : "Pending"}</span>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRuleState = useMemo(
    () =>
      passwordRules.map((rule) => ({
        ...rule,
        met: rule.test(formData.password),
      })),
    [formData.password]
  );

  const passwordMeetsRules = passwordRuleState.every((rule) => rule.met);
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const allFieldsFilled = Object.values(formData).every(
    (value) => value.trim() !== ""
  );
  const canSubmit = allFieldsFilled && passwordMeetsRules && passwordsMatch;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Registration complete. You can log in now.");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.status === 409
          ? "An employee with this email already exists."
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-20 max-w-lg">
      <Card className="p-6">
        <PageHeader
          title="Employee Registration"
          description="Create your Testing Services employee account."
          className="center-text"
          center
        />

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormField label="First Name">
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
          </FormField>

          <FormField label="Last Name">
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
          </FormField>

          <FormField label="Email Address">
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </FormField>

          <FormField label="Password">
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </FormField>

          <div className="mb-4 space-y-2">
            {passwordRuleState.map((rule) => (
              <RequirementIndicator key={rule.id} met={rule.met}>
                {rule.label}
              </RequirementIndicator>
            ))}
          </div>

          {passwordMeetsRules && (
            <Alert variant="success" className="mb-4">
              Password requirements are met.
            </Alert>
          )}

          <FormField label="Confirm Password">
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </FormField>

          <RequirementIndicator met={passwordsMatch}>
            Passwords match
          </RequirementIndicator>

          {passwordsMatch && (
            <Alert variant="success" className="mt-4">
              Password confirmation matches.
            </Alert>
          )}

          <Button
            type="submit"
            variant="primary"
            className="mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-adaptive-muted">
          Already have an account?{" "}
          <Button to="/login" variant="ghost" className="px-1 py-0">
            Log in
          </Button>
        </div>
      </Card>
    </Container>
  );
}
