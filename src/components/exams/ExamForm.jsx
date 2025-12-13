import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Section,
  FormField,
} from "@/components/ui";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function ExamForm({
  initialData,
  variants,
  onSubmit,
  onCancel,
}) {
  const [familyName, setFamilyName] = useState(initialData?.name || "");
  const [variantList, setVariantList] = useState(
    variants?.map((v) => ({ ...v, open: false })) || []
  );

  const isFacultyFamily = familyName.toLowerCase().includes("faculty");
  const isHiSET = familyName.toLowerCase().includes("hiset");
  const isAccuplacer = familyName.toLowerCase().includes("accuplacer");

  const toggleOpen = (id) => {
    setVariantList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, open: !v.open } : v))
    );
  };

  const updateVariant = (id, key, value) => {
    setVariantList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [key]: value } : v))
    );
  };

  const addVariant = () => {
    const newVariant = {
      id: Date.now(), // temp ID for JSON-Server
      familyId: initialData?.id || null,
      title: "",
      duration: 60,
      open: true,
    };

    setVariantList((prev) => [...prev, newVariant]);
  };

  const removeVariant = (id) => {
    setVariantList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      name: familyName,
      // eslint-disable-next-line no-unused-vars
      variants: variantList.map(({ open: _unused, ...clean }) => clean),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Section className="max-w-3xl mx-auto">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Test Type Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* FAMILY NAME */}
            <FormField label="Test Type Name">
              <Input
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                required
              />
            </FormField>

            <hr className="border-gray-300" />

            {/* VARIANT LIST */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-700">
                Test Variants
              </h3>
              <Button
                variant="accent"
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" /> Add Variant
              </Button>
            </div>

            {variantList.map((variant) => (
              <div
                key={variant.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                {/* HEADER ROW */}
                <div className="flex justify-between items-center">
                  <p className="font-medium text-purple-700">
                    {variant.title || "Untitled Variant"}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => toggleOpen(variant.id)}
                    >
                      {variant.open ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="flex items-center gap-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>

                {/* EXPANDED FIELDS */}
                {variant.open && (
                  <div className="mt-4 space-y-4">
                    <FormField label="Title">
                      <Input
                        value={variant.title}
                        onChange={(e) =>
                          updateVariant(variant.id, "title", e.target.value)
                        }
                        required
                      />
                    </FormField>

                    {/* HISET or ACCUPLACER SUBTEST */}
                    {(isHiSET || isAccuplacer) && (
                      <FormField label="Subtest">
                        <Input
                          value={variant.subtest || ""}
                          onChange={(e) =>
                            updateVariant(variant.id, "subtest", e.target.value)
                          }
                        />
                      </FormField>
                    )}

                    {/* FACULTY TESTS */}
                    {isFacultyFamily && (
                      <>
                        <FormField label="Faculty Name">
                          <Input
                            value={variant.facultyName || ""}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "facultyName",
                                e.target.value
                              )
                            }
                          />
                        </FormField>

                        <FormField label="Course">
                          <Input
                            value={variant.course || ""}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "course",
                                e.target.value
                              )
                            }
                          />
                        </FormField>
                      </>
                    )}

                    {/* DURATION */}
                    <FormField label="Duration (minutes)">
                      <Input
                        type="number"
                        min="1"
                        value={variant.duration}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "duration",
                            Number(e.target.value)
                          )
                        }
                        required
                      />
                    </FormField>
                  </div>
                )}
              </div>
            ))}

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>
    </form>
  );
}
