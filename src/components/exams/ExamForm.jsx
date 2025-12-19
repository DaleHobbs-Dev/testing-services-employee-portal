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
  Alert,
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
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [allowsMultipleVariants, setAllowsMultipleVariants] = useState(
    initialData?.allowsMultipleVariants ?? false
  );
  const [requiresVariantSelection, setRequiresVariantSelection] = useState(
    initialData?.requiresVariantSelection ?? true
  );
  const [defaultDuration, setDefaultDuration] = useState(
    initialData?.defaultDuration || variants?.[0]?.duration || 60 // ✅ NEW: Default duration for generic tests
  );
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
      id: Date.now(),
      familyId: initialData?.id || null,
      title: "",
      duration: 60,
      active: true,
      open: true,
    };

    setVariantList((prev) => [...prev, newVariant]);
  };

  const removeVariant = (id) => {
    setVariantList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for variant requirement
    if (requiresVariantSelection && variantList.length === 0) {
      alert("Please add at least one test variant.");
      return;
    }

    // ✅ NEW: Validation for duration when no variants required
    if (
      !requiresVariantSelection &&
      (!defaultDuration || defaultDuration < 1)
    ) {
      alert("Please enter a valid test duration.");
      return;
    }

    onSubmit({
      ...initialData,
      name: familyName,
      description,
      allowsMultipleVariants,
      requiresVariantSelection,
      defaultDuration: !requiresVariantSelection ? defaultDuration : undefined, // ✅ NEW: Pass duration
      active: true,
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

            {/* DESCRIPTION */}
            <FormField label="Description">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this test type"
              />
            </FormField>

            {/* REQUIRES VARIANT SELECTION */}
            <FormField label="Variant Selection">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresVariant"
                  checked={requiresVariantSelection}
                  onChange={(e) =>
                    setRequiresVariantSelection(e.target.checked)
                  }
                  className="h-4 w-4 text-primary-dark focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="requiresVariant"
                  className="text-sm text-gray-700"
                >
                  Requires specific variant selection when scheduling
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Uncheck this if the test type doesn't need specific variants
                (e.g., "GRE" with no subtests)
              </p>
            </FormField>

            {/* ✅ NEW: DEFAULT DURATION - Shows when variants NOT required */}
            {!requiresVariantSelection && (
              <>
                <FormField label="Test Duration (minutes)">
                  <Input
                    type="number"
                    min="1"
                    value={defaultDuration}
                    onChange={(e) => setDefaultDuration(Number(e.target.value))}
                    required
                    placeholder="e.g., 180 for 3 hours"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How long does this test typically take?
                  </p>
                </FormField>

                <Alert variant="info" className="text-sm">
                  This test type doesn't require variant selection. A default
                  variant will be created automatically with the duration you
                  specified.
                </Alert>
              </>
            )}

            {/* Only show variant management if requires variant selection */}
            {requiresVariantSelection && (
              <>
                {/* MULTIPLE VARIANTS PER SESSION */}
                <FormField label="Multiple Variants Per Session">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allowsMultiple"
                      checked={allowsMultipleVariants}
                      onChange={(e) =>
                        setAllowsMultipleVariants(e.target.checked)
                      }
                      className="h-4 w-4 text-primary-dark focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor="allowsMultiple"
                      className="text-sm text-gray-700"
                    >
                      Allow examinees to take multiple test variants in a single
                      session
                    </label>
                  </div>
                </FormField>

                <hr className="border-gray-300" />

                {/* VARIANT LIST */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-primary-dark">
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

                {variantList.length === 0 && (
                  <Alert variant="info" className="text-sm">
                    No variants added yet. Click "Add Variant" to create test
                    options.
                  </Alert>
                )}

                {variantList.map((variant) => (
                  <div
                    key={variant.id}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    {/* HEADER ROW */}
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-primary-dark">
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
                                updateVariant(
                                  variant.id,
                                  "subtest",
                                  e.target.value
                                )
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
              </>
            )}

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
