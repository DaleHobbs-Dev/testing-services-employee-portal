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
  const [originalVariantIds, setOriginalVariantIds] = useState([]);

  useEffect(() => {
    getTestFamilyById(examId).then(setFamily);
    getTestVariantsByFamilyId(examId).then((data) => {
      const activeVariants = data.filter((v) => v.active !== false);
      setVariants(activeVariants);
      setOriginalVariantIds(activeVariants.map((v) => v.id));
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
    // Update test family with all fields including requiresVariantSelection
    await updateTestFamily(examId, {
      name: data.name,
      description: data.description || "",
      allowsMultipleVariants: data.allowsMultipleVariants ?? false,
      requiresVariantSelection: data.requiresVariantSelection ?? true,
      active: true,
    });

    // Handle variants based on requiresVariantSelection
    if (data.requiresVariantSelection) {
      // Handle user-specified variants
      const updatedIds = [];

      for (const variant of data.variants) {
        if (originalVariantIds.includes(variant.id)) {
          // Existing variant → update
          updatedIds.push(variant.id);
          await updateTestVariant(variant.id, {
            ...variant,
            active: true,
          });
        } else {
          // New variant → create
          const body = {
            ...variant,
            familyId: Number(examId),
            active: true,
          };
          await createTestVariant(body);
        }
      }

      // Soft-delete removed variants
      const deletedIds = originalVariantIds.filter(
        (id) => !updatedIds.includes(id)
      );
      for (const id of deletedIds) {
        await updateTestVariant(id, { active: false });
      }
    } else {
      // ✅ UPDATED: Ensure there's a default variant with correct duration
      if (variants.length === 0) {
        // No variant exists, create one
        await createTestVariant({
          familyId: Number(examId),
          title: data.name,
          duration: data.defaultDuration || 60, // ✅ Use specified duration
          active: true,
        });
      } else {
        // ✅ UPDATED: Update existing default variant to match family name AND duration
        await updateTestVariant(variants[0].id, {
          title: data.name,
          duration: data.defaultDuration || variants[0].duration, // ✅ Update duration
          active: true,
        });
      }
    }

    navigate("/exam-list");
  };

  const handleCancel = () => navigate("/exam-list");

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
