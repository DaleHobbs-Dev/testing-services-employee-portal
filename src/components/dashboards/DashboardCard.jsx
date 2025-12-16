import { Card, CardTitle, Button } from "@/components/ui";
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
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          {icon}
          <CardTitle className="m-auto">{title}</CardTitle>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3">{description}</p>

        {/* Call to Action */}
        <div className="mt-auto pt-4">
          <Button className="hover-glow-purple">Open</Button>
        </div>
      </Link>
    </Card>
  );
}
