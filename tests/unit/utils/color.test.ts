import { normalizeHex, parseHex, rgbToHex } from "@/utils/color";
import { describe, expect, it } from "vitest";

describe("parseHex", () => {
  it("6桁HEXをRGBに変換する", () => {
    expect(parseHex("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHex("#00ff00")).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseHex("#0000ff")).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("3桁HEXをRGBに変換する", () => {
    expect(parseHex("#f00")).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHex("#0f0")).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseHex("#00f")).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("大文字HEXを処理できる", () => {
    expect(parseHex("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseHex("#AbCdEf")).toEqual({ r: 171, g: 205, b: 239 });
  });

  it("境界値を正しく処理する", () => {
    expect(parseHex("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHex("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe("rgbToHex", () => {
  it("RGBを6桁小文字HEXに変換する", () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe("#ff0000");
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe("#00ff00");
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe("#0000ff");
  });

  it("境界値を正しく処理する", () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe("#ffffff");
  });

  it("範囲外の値をクランプする", () => {
    expect(rgbToHex({ r: 300, g: -10, b: 128 })).toBe("#ff0080");
  });
});

describe("normalizeHex", () => {
  it("3桁HEXを6桁小文字に正規化する", () => {
    expect(normalizeHex("#F00")).toBe("#ff0000");
    expect(normalizeHex("#fff")).toBe("#ffffff");
  });

  it("大文字HEXを小文字に正規化する", () => {
    expect(normalizeHex("#FF0000")).toBe("#ff0000");
    expect(normalizeHex("#ABCDEF")).toBe("#abcdef");
  });

  it("既に正規化済みの値はそのまま返す", () => {
    expect(normalizeHex("#ff0000")).toBe("#ff0000");
    expect(normalizeHex("#000000")).toBe("#000000");
  });
});
