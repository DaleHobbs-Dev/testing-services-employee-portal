import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  PageHeader,
  Section,
} from "@/components";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/context";
import { employeeHasRole } from "@/utils/roleUtils";

const calendarManagementCards = [
  {
    title: "Create Calendar",
    description:
      "Start a new calendar from Jan-May, Jun-July, Aug-Dec, or a custom month range.",
    action: "Create Calendar",
    to: "/calendar-management/new",
  },
  {
    title: "Edit Calendars",
    description:
      "Select a calendar, choose a month, and update closures, labels, badges, and notes by day.",
    action: "Open Editor",
    to: "/calendar-management/edit",
  },
  {
    title: "View and Print Calendars",
    description:
      "Review calendar months with filters for locations, test types, employees, labels, notes, and hours.",
    action: "Open Viewer",
    to: "/calendar-management/view",
  },
];

export function CalendarManagementHome() {
  const { currentUser } = useCurrentUser();
  const cards = employeeHasRole(currentUser, ["admin", "technician"])
    ? [...calendarManagementCards, {
        title: "Calendar Badge Colors",
        description: "Adjust the colors used for test type and employee badges on calendars.",
        action: "Manage Colors",
        to: "/calendar-management/badge-colors",
      }]
    : calendarManagementCards;

  return (
    <Container>
      <Section className="max-w-5xl mx-auto">
        <PageHeader
          title="Calendar Management"
          description="Choose how you want to work with testing services calendars."
          center
        />

        <Grid cols={3}>
          {cards.map((card) => (
            <Card
              key={card.to}
              className="
                flex h-full flex-col
                transition-transform hover:shadow-lg hover:-translate-y-1
                focus-within:shadow-lg focus-within:-translate-y-1
                cursor-pointer
              "
            >
              <Link to={card.to} className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-adaptive-muted">
                    {card.description}
                  </p>
                  <Button className="mt-auto">{card.action}</Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
