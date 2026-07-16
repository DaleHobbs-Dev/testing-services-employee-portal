import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export const DEFAULT_DAY_NOTE_COLOR = "#FEF3C7";

const NOTE_COLORS = [
  { name: "Post-it", value: DEFAULT_DAY_NOTE_COLOR },
  { name: "Mint", value: "#D1FAE5" },
  { name: "Sky", value: "#DBEAFE" },
  { name: "Lavender", value: "#EDE9FE" },
  { name: "Rose", value: "#FFE4E6" },
  { name: "Peach", value: "#FED7AA" },
  { name: "Lime", value: "#ECFCCB" },
  { name: "Slate", value: "#E2E8F0" },
];

const normalizeHex = (value) =>
  /^#[0-9A-F]{6}$/i.test(value) ? value.toUpperCase() : DEFAULT_DAY_NOTE_COLOR;

export function DayNoteColorPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const selectedColor = normalizeHex(value);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const handleSelect = (color) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-md border border-gray-300 bg-adaptive px-3 py-2 text-left text-sm text-adaptive transition-colors hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span
            className="h-6 w-6 rounded border border-gray-300"
            style={{ backgroundColor: selectedColor }}
            aria-hidden="true"
          />
          {selectedColor}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-adaptive-muted" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-md border border-adaptive bg-adaptive p-3 shadow-lg">
          <div className="grid grid-cols-4 gap-2" role="listbox">
            {NOTE_COLORS.map((color) => {
              const isSelected = color.value === selectedColor;

              return (
                <button
                  key={color.value}
                  type="button"
                  className="flex h-10 items-center justify-center rounded-md border border-gray-300 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleSelect(color.value)}
                  aria-label={color.name}
                  aria-selected={isSelected}
                  role="option"
                  title={`${color.name} ${color.value}`}
                >
                  {isSelected && <CheckIcon className="h-5 w-5 text-gray-900" />}
                </button>
              );
            })}
          </div>

          <label className="mt-3 flex items-center justify-between gap-3 text-xs font-medium text-adaptive-muted">
            Custom
            <input
              type="color"
              value={selectedColor}
              onChange={(event) => onChange(normalizeHex(event.target.value))}
              className="h-8 w-12 cursor-pointer rounded border border-gray-300 bg-transparent p-0 dark:border-gray-600"
            />
          </label>
        </div>
      )}
    </div>
  );
}
