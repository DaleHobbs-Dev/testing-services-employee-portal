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
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Create Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-adaptive-muted">
                Start a new calendar from Jan-May, Jun-July, Aug-Dec, or a
                custom month range.
              </p>
              <Button to="/calendar-management/new" className="mt-auto">
                Create Calendar
              </Button>
            </CardContent>
          </Card>

          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Edit Calendars</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-adaptive-muted">
                Select a calendar, choose a month, and update closures, labels,
                badges, and notes by day.
              </p>
              <Button to="/calendar-management/edit" className="mt-auto">
                Open Editor
              </Button>
            </CardContent>
          </Card>

          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>View and Print Calendars</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-adaptive-muted">
                Review calendar months with filters for locations, test
                types, employees, labels, notes, and hours.
              </p>
              <Button to="/calendar-management/view" className="mt-auto">
                Open Viewer
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Section>
    </Container>
  );
}
