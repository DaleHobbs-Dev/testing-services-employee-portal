import { useNavigate } from "react-router-dom";
import { createTestFamily, createTestVariant } from "@/services";
import { PageHeader, Section, Container, Spinner } from "@/components/ui";
import ExamForm from "@/components/exams/ExamForm";
import { useState } from "react";

export default function NewExam() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      // Create family with all fields
      const newFamily = await createTestFamily({
        name: data.name,
        description: data.description || "",
        allowsMultipleVariants: data.allowsMultipleVariants ?? false,
        active: true,
      });

      // Create each variant with new familyId and active flag
      for (const variant of data.variants) {
        await createTestVariant({
          ...variant,
          familyId: newFamily.id,
          active: true,
        });
      }

      navigate("/exam-list");
    } catch (error) {
      console.error("Failed to create test family:", error);
      alert(
        "An error occurred while creating the test type. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/exam-list");

  if (loading) {
    return (
      <div className="text-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Container>
      <Section className="max-w-4xl mx-auto">
        <PageHeader
          title="Create New Test Type"
          description="Add a new test type and its available variants."
          center
        />
      </Section>

      <ExamForm
        initialData={{}}
        variants={[]} // No variants initially
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
}
