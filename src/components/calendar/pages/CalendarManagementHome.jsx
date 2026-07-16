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

export function CalendarManagementHome() {
  return (
    <Container>
      <Section className="max-w-5xl mx-auto">
        <PageHeader
          title="Calendar Management"
          description="Choose how you want to work with testing services calendars."
          center
        />

        <Grid cols={3}>
          <Card>
            <CardHeader>
              <CardTitle>Create Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-adaptive-muted">
                Start a new calendar from Jan-May, Jun-July, Aug-Dec, or a
                custom month range.
              </p>
              <Button to="/calendar-management/new">Create Calendar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Calendars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-adaptive-muted">
                Select a calendar, choose a month, and update closures, labels,
                badges, and notes by day.
              </p>
              <Button to="/calendar-management/edit">Open Editor</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Calendars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-adaptive-muted">
                Review calendar months with filters for locations, test
                families, employees, labels, notes, and hours.
              </p>
              <Button to="/calendar-management/view">Open Viewer</Button>
            </CardContent>
          </Card>
        </Grid>
      </Section>
    </Container>
  );
}
