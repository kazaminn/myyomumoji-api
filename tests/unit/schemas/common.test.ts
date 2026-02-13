import { hexColorSchema } from "@/schemas/common";
import { describe, expect, it } from "vitest";

describe("hexColorSchema", () => {
  it("6桁HEXを受け入れる", () => {
    expect(hexColorSchema.safeParse("#ff0000").success).toBe(true);
    expect(hexColorSchema.safeParse("#000000").success).toBe(true);
    expect(hexColorSchema.safeParse("#FFFFFF").success).toBe(true);
    expect(hexColorSchema.safeParse("#abcdef").success).toBe(true);
  });

  it("3桁HEXを受け入れる", () => {
    expect(hexColorSchema.safeParse("#f00").success).toBe(true);
    expect(hexColorSchema.safeParse("#FFF").success).toBe(true);
    expect(hexColorSchema.safeParse("#000").success).toBe(true);
  });

  it("#なしのHEXを拒否する", () => {
    expect(hexColorSchema.safeParse("ff0000").success).toBe(false);
  });

  it("不正な長さのHEXを拒否する", () => {
    expect(hexColorSchema.safeParse("#ff00").success).toBe(false);
    expect(hexColorSchema.safeParse("#ff00000").success).toBe(false);
    expect(hexColorSchema.safeParse("#f").success).toBe(false);
  });

  it("HEX以外の文字を拒否する", () => {
    expect(hexColorSchema.safeParse("#gggggg").success).toBe(false);
    expect(hexColorSchema.safeParse("#xyz123").success).toBe(false);
  });

  it("空文字列を拒否する", () => {
    expect(hexColorSchema.safeParse("").success).toBe(false);
  });
});
