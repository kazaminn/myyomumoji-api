import app from "@/index";
import { describe, expect, it } from "vitest";

describe("GET /api/health", () => {
  it("ステータスokを返す", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });
});
