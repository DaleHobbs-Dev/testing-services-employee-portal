import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  FormField,
  Input,
  PageHeader,
  PasswordRequirements,
  RequirementIndicator,
} from "@/components";
import { register } from "@/services";
import { passwordRules } from "@/utils/passwordRules";

const getRegistrationErrorMessage = (error) => {
  const body = error?.body;
  const message =
    (typeof body?.message === "string" && body.message) ||
    (typeof body?.detail === "string" && body.detail) ||
    (typeof body?.error === "string" && body.error) ||
    (Array.isArray(body?.errors) &&
      body.errors
        .map((item) => (typeof item === "string" ? item : item?.message))
        .filter(Boolean)
        .join(" "));

  if (message) return message;
  if (error?.status === 409) {
    return "An employee with this email already exists.";
  }
  if (error?.status === 400 || error?.status === 422) {
    return "Registration could not be completed with the information provided.";
  }
  return "Registration failed. Please try again.";
};

export function RegisterPage() {
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
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(
        response?.message ||
          "Registration request received. An administrator must approve your account before you can log in."
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setError(getRegistrationErrorMessage(error));
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

          <PasswordRequirements requirements={passwordRuleState} />

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
