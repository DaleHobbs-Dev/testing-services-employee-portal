import { Card, Button, H1 } from "@/components/ui";
import { Link } from "react-router-dom";

export default function AccessDenied({ message, returnPath = "/" }) {
  return (
    <Card className="max-w-md mx-auto mt-20 p-8 text-center">
      <H1 className="mb-4">Access Denied</H1>
      <p className="mb-6">
        {message || "You do not have permission to view this page."}
      </p>
      <Button as={Link} to={returnPath} variant="primary">
        Go to Home
      </Button>
    </Card>
  );
}
