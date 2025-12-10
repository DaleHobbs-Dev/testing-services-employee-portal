import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getTestFamilyById,
  getTestVariantsByFamilyId,
  updateTestFamily,
  updateTestVariant,
  createTestVariant,
} from "@/services";

import { Spinner, PageHeader, Section, Container } from "@/components/ui";

import ExamForm from "@/components/exams/ExamForm";

export default function EditExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [variants, setVariants] = useState(null);

  // Keep original variant IDs to detect deletions later
  const [originalVariantIds, setOriginalVariantIds] = useState([]);

  useEffect(() => {
    getTestFamilyById(examId).then(setFamily);
    getTestVariantsByFamilyId(examId).then((data) => {
      setVariants(data);
      setOriginalVariantIds(data.map((v) => v.id));
    });
  }, [examId]);
  if (!family || !variants) {
    return (
      <div className="text-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleSubmit = async (data) => {
    // 1) Update test family name
    await updateTestFamily(examId, { name: data.name });

    const updatedIds = [];

    for (const variant of data.variants) {
      if (originalVariantIds.includes(variant.id)) {
        // Existing variant → update
        updatedIds.push(variant.id);
        await updateTestVariant(variant.id, variant);
      } else {
        // New variant → create
        const body = {
          ...variant,
          familyId: Number(examId),
        };
        await createTestVariant(body);
      }
    }

    // OPTIONAL: detect deleted variants
    // const deleted = originalVariantIds.filter((id) => !updatedIds.includes(id));
    // for (const id of deleted) await deleteTestVariant(id);

    navigate("/admin-dashboard/exam-list");
  };

  const handleCancel = () => navigate("/admin-dashboard/exam-list");

  return (
    <Container>
      <Section className="max-w-4xl mx-auto">
        <PageHeader
          title={`Edit Test Type: ${family.name}`}
          description="Modify test type and its available variants."
          center
        />
      </Section>

      <ExamForm
        initialData={family}
        variants={variants}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
}
