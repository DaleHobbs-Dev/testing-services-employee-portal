import { Card, CardTitle, Button, IconWrapper } from "@/components/ui";
import { Link } from "react-router-dom";

export function DashboardCard({ icon, title, description, to }) {
  return (
    <Card
      className="
        p-8 flex flex-col h-full
        transition-transform hover:shadow-lg hover:-translate-y-1
        focus-within:shadow-lg focus-within:-translate-y-1
        cursor-pointer
      "
    >
      <Link to={to} className="flex flex-col h-full">
        {/* Header with Icon */}
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 mb-4">
          <IconWrapper>{icon}</IconWrapper>
          <CardTitle className="m-auto">{title}</CardTitle>
        </div>

        {/* Description */}
        <p className="text-md text-adaptive-muted mb-3">{description}</p>

        {/* Call to Action */}
        <div className="mt-auto pt-4">
          <Button className="hover-glow-purple">Open</Button>
        </div>
      </Link>
    </Card>
  );
}
