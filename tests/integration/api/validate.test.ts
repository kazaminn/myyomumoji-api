import app from "@/index";
import { describe, expect, it } from "vitest";

describe("POST /api/validate/batch", () => {
  it("有効なリクエストで検証結果を返す", async () => {
    const res = await app.request("/api/validate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        colors: [
          { id: "pair-1", foreground: "#000000", background: "#FFFFFF" },
        ],
        fontSize: 16,
        fontWeight: 400,
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.results).toHaveLength(1);
    expect(body.data.results[0].wcag.ratio).toBe(21);
    expect(body.data.summary.total).toBe(1);
  });

  it("複数のカラーペアを検証できる", async () => {
    const res = await app.request("/api/validate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        colors: [
          { foreground: "#000000", background: "#FFFFFF" },
          { foreground: "#333333", background: "#EEEEEE" },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.results).toHaveLength(2);
    expect(body.data.summary.total).toBe(2);
  });

  it("不正なHEXカラーでバリデーションエラーを返す", async () => {
    const res = await app.request("/api/validate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        colors: [{ foreground: "invalid", background: "#000000" }],
      }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("空のcolors配列でバリデーションエラーを返す", async () => {
    const res = await app.request("/api/validate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colors: [] }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});
