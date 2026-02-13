import type { RGB, WcagResult } from "@/types";

function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: RGB): number {
  return (
    0.2126 * toLinear(rgb.r) +
    0.7152 * toLinear(rgb.g) +
    0.0722 * toLinear(rgb.b)
  );
}

export function contrastRatio(fg: RGB, bg: RGB): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function isLargeText(fontSize: number, fontWeight: number): boolean {
  // WCAG: large text = 18pt+ normal OR 14pt+ bold (700+)
  // CSS px to pt: 1px = 0.75pt
  const fontSizePt = fontSize * 0.75;
  if (fontWeight >= 700) {
    return fontSizePt >= 14;
  }
  return fontSizePt >= 18;
}

export function evaluateWcag(fg: RGB, bg: RGB): WcagResult {
  const ratio = contrastRatio(fg, bg);

  return {
    ratio,
    normalText: {
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
    },
    largeText: {
      aa: ratio >= 3,
      aaa: ratio >= 4.5,
    },
  };
}
