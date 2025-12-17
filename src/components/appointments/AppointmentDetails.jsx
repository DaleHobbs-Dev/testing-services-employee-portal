import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/CurrentUserContext";
import {
  Container,
  Section,
  PageHeader,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Spinner,
  Alert,
  Button,
  H2,
  H3,
} from "@/components/ui";
import {
  getAllExamSchedules,
  getAllTestVariants,
  getAllExaminees,
  getAllNotes,
} from "@/services";

export default function AppointmentDetails() {
  const { currentUser } = useCurrentUser();
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        const [schedules, variants, examinees, notes] = await Promise.all([
          getAllExamSchedules(),
          getAllTestVariants(),
          getAllExaminees(),
          getAllNotes(),
        ]);

        const schedule = schedules.find((s) => s.id === Number(scheduleId));

        if (!schedule) {
          setError("Exam schedule not found");
          setLoading(false);
          return;
        }

        const variantIds =
          schedule.selectedTestVariantIds ??
          (schedule.testVariantId ? [schedule.testVariantId] : []);

        const examVariants = variantIds
          .map((id) => variants.find((v) => v.id === id))
          .filter(Boolean);

        const examinee = examinees.find((e) => e.id === schedule.examineeId);

        if (!examinee) {
          setError("Examinee not found");
          setLoading(false);
          return;
        }

        const examNotes = notes.filter((n) => n.examScheduleId === schedule.id);

        setData({ schedule, variants: examVariants, examinee, examNotes });
        setLoading(false);
      } catch (err) {
        console.error("Error loading exam details:", err);
        setError("Failed to load exam details");
        setLoading(false);
      }
    }

    loadDetails();
  }, [scheduleId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Container>
        <Section className="max-w-4xl mx-auto">
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Section>
      </Container>
    );
  }

  if (!data) return null;

  const { schedule, variants: examVariants, examinee, examNotes } = data;

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
  };

  const canEdit = ["admin", "scheduler", "proctor"].includes(currentUser?.role);

  return (
    <Container>
      <Section className="max-w-4xl mx-auto">
        <PageHeader
          title="Exam Details"
          description="Detailed information for this scheduled exam"
          center
        />

        <Card className="p-6">
          {/* Header with examinee info */}
          <CardHeader className="items-center mb-6 p-4 rounded-lg bg-primary-light/20 text-primary">
            <div className="flex items-center gap-4">
              {/* Initials avatar */}
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg shrink-0">
                {getInitials(examinee.firstName, examinee.lastName)}
              </div>
              <div className="flex-1 text-center">
                <H2 className="mb-1">
                  {examinee.firstName} {examinee.lastName}
                </H2>
                <p className="text-sm text-gray-600">{examinee.email}</p>
              </div>
              <div className="w-12 shrink-0" /> {/* Spacer for balance */}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status */}
            <div className="mb-4">
              <Badge
                size="xl"
                variant={
                  schedule.status === "checked-in" ? "success" : "warning"
                }
              >
                {schedule.status?.charAt(0).toUpperCase() +
                  schedule.status?.slice(1) || "Scheduled"}
              </Badge>
            </div>

            {/* Exam(s) */}
            <div className="mb-6">
              <H3 underline>Exam{examVariants.length > 1 ? "s" : ""}</H3>
              {examVariants.length > 1 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {examVariants.map((v) => (
                    <Badge key={v.id} variant="accent" size="lg">
                      {v.title} ({v.duration} min)
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-800 mt-1">
                  {examVariants[0]?.title} ({examVariants[0]?.duration} minutes)
                </p>
              )}
            </div>

            {/* Total Duration */}
            {examVariants.length > 1 && (
              <div className="mb-6">
                <H3 underline>Total Duration</H3>
                <p className="text-gray-800">
                  {examVariants.reduce((sum, v) => sum + v.duration, 0)} minutes
                </p>
              </div>
            )}

            {/* Scheduled Time */}
            <div className="mb-6">
              <H3 underline>Scheduled Time</H3>
              <p className="text-gray-800">
                {new Date(schedule.startTime).toLocaleString()} –{" "}
                {new Date(schedule.endTime).toLocaleTimeString()}
              </p>
            </div>

            {/* Workstation */}
            <div className="mb-6">
              <H3 underline>Workstation</H3>
              <p className="text-gray-800">
                {schedule.room}, WS-{schedule.workstationId}
              </p>
            </div>

            {/* Notes / Accommodations */}
            <div className="mb-6">
              <H3 underline>Notes / Accommodations</H3>
              {examNotes.length === 0 ? (
                <p className="text-gray-500 italic mt-1">No notes available.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {examNotes.map((n) => (
                    <p key={n.id} className="text-gray-800">
                      {n.message}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-between border-t border-gray-200">
              <Button
                onClick={() => navigate(-1)}
                variant="secondary"
                className="focus-ring"
              >
                Go Back
              </Button>

              {canEdit && (
                <Button
                  onClick={() => navigate(`/edit-appointment/${scheduleId}`)}
                  variant="primary"
                  className="focus-ring"
                >
                  Edit Appointment
                </Button>
              )}
              {/* Optional: Add more actions */}
              {/* <Button variant="primary" className="focus-ring">
                Check In
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
