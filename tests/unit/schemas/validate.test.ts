import { batchRequestSchema } from "@/schemas/validate";
import { describe, expect, it } from "vitest";

describe("batchRequestSchema", () => {
  it("有効なリクエストを受け入れる", () => {
    const result = batchRequestSchema.safeParse({
      colors: [{ foreground: "#FFFFFF", background: "#000000" }],
      fontSize: 16,
      fontWeight: 400,
    });
    expect(result.success).toBe(true);
  });

  it("fontSize/fontWeightのデフォルト値を適用する", () => {
    const result = batchRequestSchema.safeParse({
      colors: [{ foreground: "#FFFFFF", background: "#000000" }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fontSize).toBe(16);
      expect(result.data.fontWeight).toBe(400);
    }
  });

  it("colors配列が空の場合を拒否する", () => {
    const result = batchRequestSchema.safeParse({
      colors: [],
    });
    expect(result.success).toBe(false);
  });

  it("colors配列が50件を超える場合を拒否する", () => {
    const colors = Array.from({ length: 51 }, () => ({
      foreground: "#FFFFFF",
      background: "#000000",
    }));
    const result = batchRequestSchema.safeParse({ colors });
    expect(result.success).toBe(false);
  });

  it("colors配列50件を受け入れる", () => {
    const colors = Array.from({ length: 50 }, () => ({
      foreground: "#FFFFFF",
      background: "#000000",
    }));
    const result = batchRequestSchema.safeParse({ colors });
    expect(result.success).toBe(true);
  });

  it("オプショナルなidフィールドを受け入れる", () => {
    const result = batchRequestSchema.safeParse({
      colors: [{ id: "pair-1", foreground: "#FFFFFF", background: "#000000" }],
    });
    expect(result.success).toBe(true);
  });

  it("不正なfontWeightを拒否する", () => {
    const result = batchRequestSchema.safeParse({
      colors: [{ foreground: "#FFFFFF", background: "#000000" }],
      fontWeight: 350,
    });
    expect(result.success).toBe(false);
  });

  it("fontSizeの範囲外を拒否する", () => {
    expect(
      batchRequestSchema.safeParse({
        colors: [{ foreground: "#FFFFFF", background: "#000000" }],
        fontSize: 0,
      }).success,
    ).toBe(false);

    expect(
      batchRequestSchema.safeParse({
        colors: [{ foreground: "#FFFFFF", background: "#000000" }],
        fontSize: 1000,
      }).success,
    ).toBe(false);
  });
});
