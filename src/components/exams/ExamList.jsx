import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  Button,
  Badge,
  PageHeader,
  Section,
  Container,
  Alert,
  DeleteConfirmationModal,
  IconWrapper
} from "@/components/ui";
import {
  getAllTestFamilies,
  getAllTestVariants,
  deleteTestFamilyWithVariants, // ✅ UPDATED: Use the better delete function
} from "@/services";
import { FolderIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ExamList() {
  const [families, setFamilies] = useState([]);
  const [variants, setVariants] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  // ✅ NEW: Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState(null);

  const loadData = () => {
    getAllTestFamilies().then((data) => {
      // Filter to only show active families
      setFamilies(data.filter((f) => f.active !== false));
    });
    getAllTestVariants().then((data) => {
      // ✅ Filter to only show active variants
      setVariants(data.filter((v) => v.active !== false));
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pre-calc variant counts (only active variants)
  const variantCount = variants.reduce((map, v) => {
    if (v.active !== false) {
      map[v.familyId] = (map[v.familyId] || 0) + 1;
    }
    return map;
  }, {});

  // ✅ UPDATED: Open modal instead of window.confirm
  const handleDeleteClick = (family) => {
    setFamilyToDelete(family);
    setDeleteModalOpen(true);
  };

  // ✅ UPDATED: Confirm deletion from modal
  const handleConfirmDelete = async () => {
    if (!familyToDelete) return;

    setDeleting(familyToDelete.id);
    setError(null);

    try {
      await deleteTestFamilyWithVariants(familyToDelete.id); // ✅ Use improved function
      loadData(); // Reload the list
      setDeleteModalOpen(false);
      setFamilyToDelete(null);
    } catch (err) {
      console.error("Failed to delete test family:", err);
      setError("Failed to delete test family. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  // ✅ NEW: Cancel deletion
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setFamilyToDelete(null);
  };

  return (
    <Container>
      <Section className="max-w-6xl mx-auto">
        <PageHeader
          title="Test Type Management"
          description="Manage test types and their associated variants."
          center
        />

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Add New Button */}
        <div className="flex justify-end mb-6">
          <Button to="new" variant="accent">
            Add New Test Type
          </Button>
        </div>

        {/* Grid of Test Types */}
        <Grid cols={3}>
          {families.map((family) => (
            <Card
              key={family.id}
              className="p-5 shadow-sm hover:shadow-md transition"
            >
              <CardHeader className="flex items-center mb-3 p-2 rounded-lg bg-primary-light/30 text-primary">
                <IconWrapper>
                  <FolderIcon className="h-6 w-6" />
                </IconWrapper>
                <CardTitle className="text-lg font-semibold">
                  {family.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-md text-adaptive-muted">
                <p className="mb-3">
                  <span className="font-medium">Variants:</span>{" "}
                  {variantCount[family.id] || 0}
                </p>

                <div className="flex justify-center">
                  <Badge size="lg" variant="accent" className="mb-4">
                    {variantCount[family.id] || 0} test option
                    {variantCount[family.id] === 1 ? "" : "s"}
                  </Badge>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    to={`/exam-list/edit/${family.id}`}
                    variant="primary"
                    className="focus-ring"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(family)} // ✅ UPDATED
                    disabled={deleting === family.id}
                    className="focus-ring flex items-center gap-1"
                  >
                    {deleting === family.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ✅ NEW: Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Test Type"
        message="Are you sure you want to delete this test type? This will also hide all its variants from the system."
        itemName={familyToDelete?.name}
        isDeleting={deleting === familyToDelete?.id}
      />
    </Container>
  );
}
