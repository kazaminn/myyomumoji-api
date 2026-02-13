import { contrastRatio, evaluateWcag, isLargeText } from "@/services/wcag";
import { describe, expect, it } from "vitest";

describe("contrastRatio", () => {
  it("黒と白のコントラスト比は21:1", () => {
    const ratio = contrastRatio(
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    );
    expect(ratio).toBe(21);
  });

  it("同色のコントラスト比は1:1", () => {
    const ratio = contrastRatio(
      { r: 128, g: 128, b: 128 },
      { r: 128, g: 128, b: 128 },
    );
    expect(ratio).toBe(1);
  });

  it("引数の順序に関わらず同じ結果を返す", () => {
    const fg = { r: 255, g: 0, b: 0 };
    const bg = { r: 0, g: 0, b: 255 };
    expect(contrastRatio(fg, bg)).toBe(contrastRatio(bg, fg));
  });

  it("コントラスト比は1以上21以下", () => {
    const ratio = contrastRatio(
      { r: 100, g: 50, b: 200 },
      { r: 200, g: 100, b: 50 },
    );
    expect(ratio).toBeGreaterThanOrEqual(1);
    expect(ratio).toBeLessThanOrEqual(21);
  });
});

describe("isLargeText", () => {
  it("18pt以上（24px以上）の通常テキストはlarge", () => {
    // 24px * 0.75 = 18pt
    expect(isLargeText(24, 400)).toBe(true);
  });

  it("18pt未満の通常テキストはlargeではない", () => {
    expect(isLargeText(23, 400)).toBe(false);
  });

  it("14pt以上（18.67px以上）のboldテキストはlarge", () => {
    // 19px * 0.75 = 14.25pt >= 14pt
    expect(isLargeText(19, 700)).toBe(true);
  });

  it("14pt未満のboldテキストはlargeではない", () => {
    // 18px * 0.75 = 13.5pt < 14pt
    expect(isLargeText(18, 700)).toBe(false);
  });
});

describe("evaluateWcag", () => {
  it("高コントラスト（黒白）でAAA判定", () => {
    const result = evaluateWcag(
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    );
    expect(result.ratio).toBe(21);
    expect(result.normalText.aa).toBe(true);
    expect(result.normalText.aaa).toBe(true);
    expect(result.largeText.aa).toBe(true);
    expect(result.largeText.aaa).toBe(true);
  });

  it("同色でFAIL判定", () => {
    const result = evaluateWcag(
      { r: 128, g: 128, b: 128 },
      { r: 128, g: 128, b: 128 },
    );
    expect(result.ratio).toBe(1);
    expect(result.normalText.aa).toBe(false);
    expect(result.normalText.aaa).toBe(false);
    expect(result.largeText.aa).toBe(false);
    expect(result.largeText.aaa).toBe(false);
  });

  it("中程度のコントラストでAA判定（AAA不可）", () => {
    // 灰色(#767676)と白(#FFFFFF)のコントラスト比 ≈ 4.54
    const result = evaluateWcag(
      { r: 118, g: 118, b: 118 },
      { r: 255, g: 255, b: 255 },
    );
    expect(result.normalText.aa).toBe(true);
    expect(result.normalText.aaa).toBe(false);
    expect(result.largeText.aa).toBe(true);
    expect(result.largeText.aaa).toBe(true);
  });
});
