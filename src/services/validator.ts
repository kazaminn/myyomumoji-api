import type {
  BatchValidationData,
  ColorPair,
  ValidationResult,
  ValidationSummary,
} from "@/types";
import { parseHex, normalizeHex } from "@/utils/color";
import { evaluateWcag, isLargeText } from "@/services/wcag";
import { evaluateApca } from "@/services/apca";
import { evaluateColorblind } from "@/services/colorblind";

export function validateBatch(
  colors: ColorPair[],
  fontSize: number,
  fontWeight: number
): BatchValidationData {
  const results: ValidationResult[] = colors.map((pair) => {
    const fg = parseHex(pair.foreground);
    const bg = parseHex(pair.background);
    const fgHex = normalizeHex(pair.foreground);
    const bgHex = normalizeHex(pair.background);

    return {
      id: pair.id,
      foreground: fgHex,
      background: bgHex,
      wcag: evaluateWcag(fg, bg),
      apca: evaluateApca(fgHex, bgHex, fontWeight),
      colorblind: evaluateColorblind(fg, bg),
    };
  });

  const summary = buildSummary(results, fontSize, fontWeight);

  return { results, summary };
}

function buildSummary(
  results: ValidationResult[],
  fontSize: number,
  fontWeight: number
): ValidationSummary {
  const large = isLargeText(fontSize, fontWeight);

  let wcagAAPassed = 0;
  let wcagAAAPassed = 0;
  let apcaGood = 0;

  for (const r of results) {
    const aa = large
      ? r.wcag.largeText.aa
      : r.wcag.normalText.aa;
    const aaa = large
      ? r.wcag.largeText.aaa
      : r.wcag.normalText.aaa;

    if (aa) wcagAAPassed++;
    if (aaa) wcagAAAPassed++;
    if (
      r.apca.rating === "good" ||
      r.apca.rating === "excellent"
    ) {
      apcaGood++;
    }
  }

  return {
    total: results.length,
    wcagAA: {
      passed: wcagAAPassed,
      failed: results.length - wcagAAPassed,
    },
    wcagAAA: {
      passed: wcagAAAPassed,
      failed: results.length - wcagAAAPassed,
    },
    apcaGood,
  };
}
