import { Alert, Button, Card, Container, PageHeader } from "@/components";
import { AUTH_FAILURE_KEY } from "@/services/apiSettings";

export function UnauthorizedPage() {
  const handleReturnToLogin = () => {
    sessionStorage.removeItem(AUTH_FAILURE_KEY);
  };

  return (
    <Container className="mt-20 max-w-lg">
      <Card className="p-8 text-center">
        <PageHeader title="Session expired" center />
        <Alert variant="warning" className="mb-6 text-left" role="alert">
          Your session is no longer valid, or you are not authorized to access
          this page. Please log in again.
        </Alert>
        <Button to="/login" variant="primary" onClick={handleReturnToLogin}>
          Return to Login
        </Button>
      </Card>
    </Container>
  );
}
