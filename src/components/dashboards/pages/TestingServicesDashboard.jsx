import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  PageHeader,
  Section,
  Container,
  dashboardCards,
  DashboardCard,
  UserNotifications,
} from "@/components";
import { useCurrentUser } from "@/context";
import { getEmployeeDisplayName } from "@/utils/employeeUtils";
import { employeeHasRole } from "@/utils/roleUtils";

export function TestingServicesDashboard() {
  const { currentUser } = useCurrentUser();

  const visibleCards = dashboardCards.filter((card) =>
    employeeHasRole(currentUser, card.roles)
  );

  return (
    <Container>
      <Section className="max-w-5xl mx-auto px-1 py-1">
        <PageHeader
          title="Testing Services Dashboard"
          description="Choose an area to get started."
          center
        />

        <UserNotifications />

        <Card className="p-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">
              Welcome, {getEmployeeDisplayName(currentUser)}
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
