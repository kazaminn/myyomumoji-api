import { calcAPCA, fontLookupAPCA } from "apca-w3";
import type { ApcaResult } from "@/types";

function getRating(
  absLc: number
): ApcaResult["rating"] {
  if (absLc >= 75) return "excellent";
  if (absLc >= 60) return "good";
  if (absLc >= 45) return "marginal";
  return "poor";
}

export function evaluateApca(
  fgHex: string,
  bgHex: string,
  fontWeight: number
): ApcaResult {
  const lc = calcAPCA(fgHex, bgHex);
  const absLc = Math.abs(lc);
  const roundedLc = Math.round(lc * 10) / 10;

  const fontArray = fontLookupAPCA(absLc);
  // fontArray: [contrastValue, w100, w200, ..., w900]
  // fontWeight 100 = index 1, 400 = index 4, 900 = index 9
  const weightIndex = fontWeight / 100;
  const minimumFontSize = fontArray[weightIndex] ?? 999;

  return {
    lc: roundedLc,
    rating: getRating(absLc),
    minimumFontSize,
  };
}
