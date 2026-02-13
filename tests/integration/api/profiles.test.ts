import { db } from "@/config/firebase";
import app from "@/index";
import { afterAll, describe, expect, it } from "vitest";

const COLLECTION_PATH = "public/profiles/data";
const createdIds: string[] = [];

const validBody = {
  nickname: "APIテスト設定",
  preferences: {
    typography: {
      fontFamily: "sans-serif",
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 1.8,
    },
    colors: {
      foreground: "#FFFFFF",
      background: "#000000",
    },
  },
};

afterAll(async () => {
  for (const id of createdIds) {
    try {
      await db.collection(COLLECTION_PATH).doc(id).delete();
    } catch {
      // 既に削除済み
    }
  }
});

describe("POST /api/profiles", () => {
  it("プロフィールを作成し201を返す", async () => {
    const res = await app.request("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.profileId).toMatch(/^mym-[a-z0-9]{8}$/);
    expect(body.data.nickname).toBe("APIテスト設定");
    expect(body.data.accessibility_thresholds.wcagLevel).toBe("AAA");
    createdIds.push(body.data.profileId);
  });

  it("nicknameが欠けている場合400を返す", async () => {
    const res = await app.request("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: validBody.preferences }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("不正なfontWeightで400を返す", async () => {
    const res = await app.request("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validBody,
        preferences: {
          ...validBody.preferences,
          typography: {
            ...validBody.preferences.typography,
            fontWeight: 450,
          },
        },
      }),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/profiles/:id", () => {
  it("作成済みプロフィールを取得できる", async () => {
    // 先にプロフィールを作成
    const createRes = await app.request("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const created = await createRes.json();
    createdIds.push(created.data.profileId);

    const res = await app.request(`/api/profiles/${created.data.profileId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.profileId).toBe(created.data.profileId);
  });

  it("存在しないIDで404を返す", async () => {
    const res = await app.request("/api/profiles/mym-notfound");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("不正なID形式で400を返す", async () => {
    const res = await app.request("/api/profiles/invalid-id");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("INVALID_PROFILE_ID");
  });
});

describe("PATCH /api/profiles/:id", () => {
  it("nicknameを更新できる", async () => {
    const createRes = await app.request("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const created = await createRes.json();
    createdIds.push(created.data.profileId);

    const res = await app.request(`/api/profiles/${created.data.profileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: "更新後" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.nickname).toBe("更新後");
  });

  it("空の更新ボディで400を返す", async () => {
    const createRes = await app.request("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const created = await createRes.json();
    createdIds.push(created.data.profileId);

    const res = await app.request(`/api/profiles/${created.data.profileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("存在しないIDで404を返す", async () => {
    const res = await app.request("/api/profiles/mym-notfound", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: "テスト" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/profiles/:id", () => {
  it("プロフィールを削除できる", async () => {
    const createRes = await app.request("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const created = await createRes.json();

    const res = await app.request(`/api/profiles/${created.data.profileId}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeNull();

    // 削除後に取得すると404
    const getRes = await app.request(`/api/profiles/${created.data.profileId}`);
    expect(getRes.status).toBe(404);
  });

  it("存在しないIDで404を返す", async () => {
    const res = await app.request("/api/profiles/mym-notfound", {
      method: "DELETE",
    });
    expect(res.status).toBe(404);
  });
});
