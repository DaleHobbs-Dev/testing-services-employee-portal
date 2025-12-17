import { H2, H3, Label, Select } from "@/components/ui";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function TestSelector({
  testFamilies,
  testVariants,
  selectedFamilyId,
  selectedVariantId,
  multiVariantIds,
  onFamilyChange,
  onVariantChange,
  onMultiVariantChange,
}) {
  const selectedFamily = testFamilies.find(
    (family) => family.id === Number(selectedFamilyId)
  );

  const variantsForFamily = testVariants.filter(
    (variant) => variant.familyId === Number(selectedFamilyId)
  );

  const isMultiVariantFamily =
    selectedFamily?.name === "HiSET" || selectedFamily?.name === "Accuplacer";

  return (
    <>
      <H2 className="mt-8 mb-4">
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          <ClipboardDocumentListIcon className="w-8 h-8 text-primary" />
          Test Information
        </div>
      </H2>

      <Label>Test Type</Label>
      <Select value={selectedFamilyId || ""} onChange={onFamilyChange}>
        <option value="">Select Test Type</option>
        {testFamilies.map((family) => (
          <option key={family.id} value={family.id}>
            {family.name}
          </option>
        ))}
      </Select>

      {/* VARIANT SELECTOR */}
      {selectedFamily && (
        <>
          <H3 className="mt-6 mb-2">Test Variant</H3>

          {isMultiVariantFamily ? (
            <div className="flex flex-col gap-2">
              {variantsForFamily.map((variant) => (
                <label key={variant.id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={variant.id}
                    checked={multiVariantIds.includes(variant.id)}
                    onChange={() => onMultiVariantChange(variant.id)}
                  />
                  {variant.title}
                </label>
              ))}
            </div>
          ) : (
            <Select value={selectedVariantId || ""} onChange={onVariantChange}>
              <option value="">Select Variant</option>
              {variantsForFamily.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </Select>
          )}
        </>
      )}
    </>
  );
}
