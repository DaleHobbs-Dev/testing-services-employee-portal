const hexToRgb = (hex) => {
  const cleanHex = hex.replace("#", "");
  const value = parseInt(cleanHex, 16);

  if (Number.isNaN(value)) return null;

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const getRelativeLuminance = ({ r, g, b }) => {
  const [red, green, blue] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const getContrastRatio = (first, second) => {
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
};

export const getReadableTextColor = (backgroundColor) => {
  if (!backgroundColor?.startsWith("#")) return "#111827";

  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return "#111827";

  const luminance = getRelativeLuminance(rgb);
  const blackContrast = getContrastRatio(luminance, 0);
  const whiteContrast = getContrastRatio(luminance, 1);

  return blackContrast >= whiteContrast ? "#111827" : "#FFFFFF";
};

