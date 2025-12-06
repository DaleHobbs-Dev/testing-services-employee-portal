import {
  Button,
  Input,
  FormField,
  H1,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  PageHeader,
  Section,
  Container,
} from "@/components/ui";

export default function NewTestingAppointment() {
  return (
    <Container>
      <Section>
        <PageHeader>
          <H1>New Testing Appointment</H1>
        </PageHeader>
        <Card>
          <CardHeader>
            <CardTitle>Schedule a New Testing Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <FormField label="Student Name">
                <Input type="text" placeholder="Enter student name" />
              </FormField>
              <FormField label="Test Type">
                <Select>
                  <option value="math">Math</option>
                  <option value="reading">Reading</option>
                  <option value="science">Science</option>
                </Select>
              </FormField>
              <FormField label="Appointment Date">
                <Input type="date" />
              </FormField>
              <FormField label="Appointment Time">
                <Input type="time" />
              </FormField>
              <Button variant="primary" type="submit">
                Schedule Appointment
              </Button>
            </form>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
