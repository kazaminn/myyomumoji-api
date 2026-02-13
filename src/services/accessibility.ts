import { evaluateApca } from "@/services/apca";
import { evaluateColorblind } from "@/services/colorblind";
import { evaluateWcag, isLargeText } from "@/services/wcag";
import type {
  AccessibilityThresholds,
  ProfilePreferences,
} from "@/types/profile";
import { normalizeHex, parseHex } from "@/utils/color";

export function computeAccessibilityThresholds(
  preferences: ProfilePreferences,
): AccessibilityThresholds {
  const { typography, colors } = preferences;

  const fg = parseHex(colors.foreground);
  const bg = parseHex(colors.background);
  const fgHex = normalizeHex(colors.foreground);
  const bgHex = normalizeHex(colors.background);

  const wcag = evaluateWcag(fg, bg);
  const large = isLargeText(typography.fontSize, typography.fontWeight);
  const textLevel = large ? wcag.largeText : wcag.normalText;
  const wcagLevel = textLevel.aaa ? "AAA" : textLevel.aa ? "AA" : "FAIL";

  const apca = evaluateApca(fgHex, bgHex, typography.fontWeight);

  const cb = evaluateColorblind(fg, bg);
  const isColorblindSafe =
    cb.protanopia.safe && cb.deuteranopia.safe && cb.tritanopia.safe;

  return {
    wcagRatio: wcag.ratio,
    wcagLevel,
    apcaLc: Math.abs(apca.lc),
    isColorblindSafe,
  };
}
