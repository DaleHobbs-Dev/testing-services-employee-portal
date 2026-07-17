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
import { changePassword } from "@/services";
import { passwordRules } from "@/utils/passwordRules";

export function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRuleState = useMemo(
    () =>
      passwordRules.map((rule) => ({
        ...rule,
        met: rule.test(formData.newPassword),
      })),
    [formData.newPassword]
  );

  const passwordMeetsRules = passwordRuleState.every((rule) => rule.met);
  const passwordsMatch =
    formData.newPassword.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;
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
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password updated successfully.");
    } catch (error) {
      console.error("Password change error:", error);
      setError(
        error.status === 401 || error.status === 403
          ? "Your current password is incorrect."
          : "Password update failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-20 max-w-lg">
      <Card className="p-6">
        <PageHeader
          title="Change Password"
          description="Enter your current password and choose a new one."
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
          <FormField label="Current Password">
            <Input
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </FormField>

          <FormField label="New Password">
            <Input
              name="newPassword"
              type="password"
              value={formData.newPassword}
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

          <FormField label="Confirm New Password">
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
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
