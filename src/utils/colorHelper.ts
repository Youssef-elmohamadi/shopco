/**
 * Color Helper Utilities for detecting and resolving color names from hex codes.
 */

const NAMED_COLORS: { name: string; hex: string; r: number; g: number; b: number }[] = [
  { name: "Black", hex: "#000000", r: 0, g: 0, b: 0 },
  { name: "White", hex: "#ffffff", r: 255, g: 255, b: 255 },
  { name: "Red", hex: "#ff0000", r: 255, g: 0, b: 0 },
  { name: "Green", hex: "#008000", r: 0, g: 128, b: 0 },
  { name: "Lime", hex: "#00ff00", r: 0, g: 255, b: 0 },
  { name: "Blue", hex: "#0000ff", r: 0, g: 0, b: 255 },
  { name: "Navy", hex: "#000080", r: 0, g: 0, b: 128 },
  { name: "Dark Blue", hex: "#00008b", r: 0, g: 0, b: 139 },
  { name: "Royal Blue", hex: "#4169e1", r: 65, g: 105, b: 225 },
  { name: "Sky Blue", hex: "#87ceeb", r: 135, g: 206, b: 235 },
  { name: "Light Blue", hex: "#add8e6", r: 173, g: 216, b: 230 },
  { name: "Cyan", hex: "#00ffff", r: 0, g: 255, b: 255 },
  { name: "Teal", hex: "#008080", r: 0, g: 128, b: 128 },
  { name: "Yellow", hex: "#ffff00", r: 255, g: 255, b: 0 },
  { name: "Orange", hex: "#ffa500", r: 255, g: 165, b: 0 },
  { name: "Purple", hex: "#800080", r: 128, g: 0, b: 128 },
  { name: "Indigo", hex: "#4b0082", r: 75, g: 0, b: 130 },
  { name: "Violet", hex: "#ee82ee", r: 238, g: 130, b: 238 },
  { name: "Pink", hex: "#ffc0cb", r: 255, g: 192, b: 203 },
  { name: "Brown", hex: "#a52a2a", r: 165, g: 42, b: 42 },
  { name: "Gray", hex: "#808080", r: 128, g: 128, b: 128 },
  { name: "Light Gray", hex: "#d3d3d3", r: 211, g: 211, b: 211 },
  { name: "Dark Gray", hex: "#a9a9a9", r: 169, g: 169, b: 169 },
  { name: "Beige", hex: "#f5f5dc", r: 245, g: 245, b: 220 },
  { name: "Maroon", hex: "#800000", r: 128, g: 0, b: 0 },
  { name: "Olive", hex: "#808000", r: 128, g: 128, b: 0 },
  { name: "Gold", hex: "#ffd700", r: 255, g: 215, b: 0 },
  { name: "Silver", hex: "#c0c0c0", r: 192, g: 192, b: 192 },
];

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function getColorNameFromHex(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "";

  let closest = NAMED_COLORS[0];
  let minDistance = Infinity;

  for (const color of NAMED_COLORS) {
    // Redmean color distance metric for human visual perception
    const rMean = (rgb.r + color.r) / 2;
    const deltaR = rgb.r - color.r;
    const deltaG = rgb.g - color.g;
    const deltaB = rgb.b - color.b;
    const distance = Math.sqrt(
      (2 + rMean / 256) * (deltaR * deltaR) +
      4 * (deltaG * deltaG) +
      (2 + (255 - rMean) / 256) * (deltaB * deltaB)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }

  return closest.name;
}

export function resolveColorName(colorHex?: string, colorName?: string): string {
  const trimmedName = (colorName || "").trim();
  if (!colorHex) return trimmedName;

  const detectedName = getColorNameFromHex(colorHex);
  
  if (!trimmedName) {
    return detectedName;
  }

  // Check for obvious mismatches (e.g. Hex is Blue/Red/Green, but name was left as default "Black")
  const rgb = hexToRgb(colorHex);
  if (rgb) {
    const isActuallyBlack = rgb.r < 40 && rgb.g < 40 && rgb.b < 40;
    if (trimmedName.toLowerCase() === "black" && !isActuallyBlack) {
      return detectedName;
    }
    const isActuallyWhite = rgb.r > 220 && rgb.g > 220 && rgb.b > 220;
    if (trimmedName.toLowerCase() === "white" && !isActuallyWhite) {
      return detectedName;
    }
  }

  return trimmedName;
}
