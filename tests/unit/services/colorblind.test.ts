import { evaluateColorblind } from "@/services/colorblind";
import { describe, expect, it } from "vitest";

describe("evaluateColorblind", () => {
  it("黒白で全3種が安全判定", () => {
    const result = evaluateColorblind(
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    );
    expect(result.protanopia.safe).toBe(true);
    expect(result.deuteranopia.safe).toBe(true);
    expect(result.tritanopia.safe).toBe(true);
  });

  it("各シミュレーション結果にHEXカラーを含む", () => {
    const result = evaluateColorblind(
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 0, b: 255 },
    );
    expect(result.protanopia.simulated).toMatch(/^#[0-9a-f]{6}$/);
    expect(result.deuteranopia.simulated).toMatch(/^#[0-9a-f]{6}$/);
    expect(result.tritanopia.simulated).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("3種のシミュレーション結果を返す", () => {
    const result = evaluateColorblind(
      { r: 200, g: 100, b: 50 },
      { r: 50, g: 100, b: 200 },
    );
    expect(result).toHaveProperty("protanopia");
    expect(result).toHaveProperty("deuteranopia");
    expect(result).toHaveProperty("tritanopia");
    for (const key of ["protanopia", "deuteranopia", "tritanopia"] as const) {
      expect(result[key]).toHaveProperty("safe");
      expect(result[key]).toHaveProperty("simulated");
    }
  });

  it("同色の場合は全て安全でない", () => {
    const result = evaluateColorblind(
      { r: 128, g: 128, b: 128 },
      { r: 128, g: 128, b: 128 },
    );
    expect(result.protanopia.safe).toBe(false);
    expect(result.deuteranopia.safe).toBe(false);
    expect(result.tritanopia.safe).toBe(false);
  });
});
