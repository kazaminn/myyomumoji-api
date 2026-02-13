import { evaluateApca } from "@/services/apca";
import { describe, expect, it } from "vitest";

describe("evaluateApca", () => {
  it("黒文字に白背景で高いLc値を返す", () => {
    const result = evaluateApca("#000000", "#ffffff", 400);
    expect(Math.abs(result.lc)).toBeGreaterThan(100);
    expect(result.rating).toBe("excellent");
  });

  it("白文字に黒背景で高いLc値を返す", () => {
    const result = evaluateApca("#ffffff", "#000000", 400);
    expect(Math.abs(result.lc)).toBeGreaterThan(100);
    expect(result.rating).toBe("excellent");
  });

  it("同色でLc値0付近を返す", () => {
    const result = evaluateApca("#808080", "#808080", 400);
    expect(Math.abs(result.lc)).toBeLessThan(1);
    expect(result.rating).toBe("poor");
  });

  it("rating判定が正しい", () => {
    // 高コントラスト → excellent
    const high = evaluateApca("#000000", "#ffffff", 400);
    expect(high.rating).toBe("excellent");

    // 低コントラスト → poor
    const low = evaluateApca("#777777", "#888888", 400);
    expect(low.rating).toBe("poor");
  });

  it("minimumFontSizeを返す", () => {
    const result = evaluateApca("#000000", "#ffffff", 400);
    expect(typeof result.minimumFontSize).toBe("number");
  });
});
