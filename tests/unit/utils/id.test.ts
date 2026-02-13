import { generateProfileId } from "@/utils/id";
import { describe, expect, it } from "vitest";

describe("generateProfileId", () => {
  it("mym-プレフィックスで始まる", () => {
    const id = generateProfileId();
    expect(id.startsWith("mym-")).toBe(true);
  });

  it("全長12文字（プレフィックス4文字 + 8文字）", () => {
    const id = generateProfileId();
    expect(id).toHaveLength(12);
  });

  it("英小文字と数字のみで構成される", () => {
    const id = generateProfileId();
    expect(id).toMatch(/^mym-[a-z0-9]{8}$/);
  });

  it("複数回呼び出すと異なるIDを生成する", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateProfileId()));
    expect(ids.size).toBe(100);
  });
});
