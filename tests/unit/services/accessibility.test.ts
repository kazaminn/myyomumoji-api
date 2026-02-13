import { computeAccessibilityThresholds } from "@/services/accessibility";
import type { ProfilePreferences } from "@/types/profile";
import { describe, expect, it } from "vitest";

const highContrastPreferences: ProfilePreferences = {
  typography: {
    fontFamily: "sans-serif",
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.8,
  },
  colors: {
    foreground: "#ffffff",
    background: "#000000",
  },
};

const lowContrastPreferences: ProfilePreferences = {
  typography: {
    fontFamily: "sans-serif",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  colors: {
    foreground: "#888888",
    background: "#999999",
  },
};

describe("computeAccessibilityThresholds", () => {
  it("高コントラストでAAA判定を返す", () => {
    const result = computeAccessibilityThresholds(highContrastPreferences);
    expect(result.wcagLevel).toBe("AAA");
    expect(result.wcagRatio).toBe(21);
    expect(result.apcaLc).toBeGreaterThan(100);
    expect(result.isColorblindSafe).toBe(true);
  });

  it("低コントラストでFAIL判定を返す", () => {
    const result = computeAccessibilityThresholds(lowContrastPreferences);
    expect(result.wcagLevel).toBe("FAIL");
    expect(result.wcagRatio).toBeLessThan(4.5);
    expect(result.isColorblindSafe).toBe(false);
  });

  it("返り値の型が正しい", () => {
    const result = computeAccessibilityThresholds(highContrastPreferences);
    expect(typeof result.wcagRatio).toBe("number");
    expect(["AAA", "AA", "FAIL"]).toContain(result.wcagLevel);
    expect(typeof result.apcaLc).toBe("number");
    expect(typeof result.isColorblindSafe).toBe("boolean");
  });

  it("3桁HEXカラーも処理できる", () => {
    const prefs: ProfilePreferences = {
      ...highContrastPreferences,
      colors: { foreground: "#FFF", background: "#000" },
    };
    const result = computeAccessibilityThresholds(prefs);
    expect(result.wcagLevel).toBe("AAA");
  });

  it("apcaLcは常に0以上（絶対値）", () => {
    const result = computeAccessibilityThresholds(highContrastPreferences);
    expect(result.apcaLc).toBeGreaterThanOrEqual(0);
  });
});
