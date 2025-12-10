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
} from "@/components/ui";
import { getAllTestFamilies, getAllTestVariants } from "@/services";
import { FolderIcon } from "@heroicons/react/24/outline";

export default function ExamList() {
  const [families, setFamilies] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    getAllTestFamilies().then(setFamilies);
    getAllTestVariants().then(setVariants);
  }, []);

  // Pre-calc variant counts
  const variantCount = variants.reduce((map, v) => {
    map[v.familyId] = (map[v.familyId] || 0) + 1;
    return map;
  }, {});

  return (
    <Container>
      <Section className="max-w-6xl mx-auto">
        <PageHeader
          title="Test Type Management"
          description="Manage test types and their associated variants."
          center
        />

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
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FolderIcon className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {family.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-md text-gray-600">
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

                <div className="flex justify-end">
                  <Button
                    to={`/admin-dashboard/exam-list/edit/${family.id}`}
                    variant="primary"
                    className="focus-ring"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  );
}
