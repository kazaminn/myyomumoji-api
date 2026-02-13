import { simulate } from "@bjornlu/colorblind";
import type {
  RGB,
  ColorblindResult,
  ColorblindSimulation,
} from "@/types";
import { rgbToHex } from "@/utils/color";
import { contrastRatio } from "@/services/wcag";

type ColorblindType =
  | "protanopia"
  | "deuteranopia"
  | "tritanopia";

function simulateAndEvaluate(
  fg: RGB,
  bg: RGB,
  type: ColorblindType
): ColorblindSimulation {
  const simFg = simulate(fg, type);
  const simBg = simulate(bg, type);

  const ratio = contrastRatio(simFg, simBg);

  return {
    safe: ratio >= 4.5,
    simulated: rgbToHex(simFg),
  };
}

export function evaluateColorblind(
  fg: RGB,
  bg: RGB
): ColorblindResult {
  return {
    protanopia: simulateAndEvaluate(fg, bg, "protanopia"),
    deuteranopia: simulateAndEvaluate(
      fg,
      bg,
      "deuteranopia"
    ),
    tritanopia: simulateAndEvaluate(fg, bg, "tritanopia"),
  };
}
