import { AcademicCapIcon, BeakerIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Container, Grid, PageHeader, Section } from "@/components";

const cards = [
  {
    title: "Test Type Management",
    description: "Create, update, deactivate, and reactivate the test types available throughout the portal.",
    to: "/exam-management/test-types",
    icon: <AcademicCapIcon className="h-7 w-7 text-primary" />,
    enabled: true,
  },
  {
    title: "Test Variant Management",
    description: "A dedicated area for managing the variants associated with each test type.",
    icon: <BeakerIcon className="h-7 w-7 text-primary" />,
    enabled: false,
  },
];

export function ExamManagementHome() {
  return (
    <Container>
      <Section className="max-w-5xl mx-auto">
        <PageHeader title="Exam Management" description="Manage the exam configuration used by Testing Services." center />
        <Grid cols={2}>
          {cards.map((card) => {
            const content = (
              <>
                <CardHeader className="flex items-center gap-3">
                  {card.icon}
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-adaptive-muted">{card.description}</p>
                  {card.enabled ? (
                    <Button className="mt-auto">Open</Button>
                  ) : (
                    <span className="mt-auto text-sm font-medium text-adaptive-muted">Coming soon</span>
                  )}
                </CardContent>
              </>
            );

            return (
              <Card
                key={card.title}
                className={`flex h-full flex-col ${card.enabled ? "cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg" : ""}`}
              >
                {card.enabled ? (
                  <Link to={card.to} className="flex h-full flex-col">
                    {content}
                  </Link>
                ) : content}
              </Card>
            );
          })}
        </Grid>
      </Section>
    </Container>
  );
}
