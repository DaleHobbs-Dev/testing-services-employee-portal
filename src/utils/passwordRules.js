export const passwordRules = [
  {
    id: "length",
    label: "At least 15 characters",
    test: (value) => value.length >= 15,
  },
  {
    id: "maxBytes",
    label: "No more than 72 UTF-8 bytes",
    test: (value) => new TextEncoder().encode(value).length <= 72,
  },
  {
    id: "uppercase",
    label: "At least one capital letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "At least one number",
    test: (value) => /\d/.test(value),
  },
  {
    id: "special",
    label: "At least one special character",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];
