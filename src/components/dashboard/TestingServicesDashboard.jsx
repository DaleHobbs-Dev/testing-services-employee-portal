import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  PageHeader,
  Section,
  Container,
} from "@/components/ui";
import { dashboardCards } from "./dashboardCards";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useCurrentUser } from "@/context/CurrentUserContext";

export default function TestingServicesDashboard() {
  const { currentUser } = useCurrentUser();
  const role = currentUser?.role;

  const visibleCards = dashboardCards.filter((card) =>
    card.roles.includes(role)
  );

  return (
    <Container>
      <Section className="max-w-5xl mx-auto px-1 py-1">
        <PageHeader
          title="Testing Services Dashboard"
          description="Choose an area to get started."
          center
        />

        <Card className="p-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">
              Welcome, {currentUser?.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {visibleCards.map((card) => (
              <DashboardCard key={card.id} {...card} />
            ))}
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
