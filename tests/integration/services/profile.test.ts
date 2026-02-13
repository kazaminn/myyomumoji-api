import { db } from "@/config/firebase";
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "@/services/profile";
import type { CreateProfileInput } from "@/types/profile";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const COLLECTION_PATH = "public/profiles/data";
const createdIds: string[] = [];

const validInput: CreateProfileInput = {
  nickname: "テスト設定",
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

describe("Profile Service 統合テスト", () => {
  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await db.collection(COLLECTION_PATH).doc(id).delete();
      } catch {
        // 既に削除済みの場合は無視
      }
    }
  });

  describe("createProfile", () => {
    it("プロフィールを作成し、レスポンスを返す", async () => {
      const result = await createProfile(validInput);
      createdIds.push(result.profileId);

      expect(result.profileId).toMatch(/^mym-[a-z0-9]{8}$/);
      expect(result.nickname).toBe("テスト設定");
      expect(result.preferences.typography.fontFamily).toBe("sans-serif");
      expect(result.preferences.colors.foreground).toBe("#ffffff");
      expect(result.preferences.colors.background).toBe("#000000");
    });

    it("アクセシビリティ閾値を自動計算する", async () => {
      const result = await createProfile(validInput);
      createdIds.push(result.profileId);

      expect(result.accessibility_thresholds.wcagRatio).toBe(21);
      expect(result.accessibility_thresholds.wcagLevel).toBe("AAA");
      expect(result.accessibility_thresholds.apcaLc).toBeGreaterThan(100);
      expect(result.accessibility_thresholds.isColorblindSafe).toBe(true);
    });

    it("metadataにpublicUrlとタイムスタンプを含む", async () => {
      const result = await createProfile(validInput);
      createdIds.push(result.profileId);

      expect(result.metadata.publicUrl).toContain(result.profileId);
      expect(result.metadata.createdAt).toBeTruthy();
      expect(result.metadata.updatedAt).toBeTruthy();
    });

    it("HEXカラーを正規化して保存する", async () => {
      const input: CreateProfileInput = {
        ...validInput,
        preferences: {
          ...validInput.preferences,
          colors: { foreground: "#FFF", background: "#000" },
        },
      };
      const result = await createProfile(input);
      createdIds.push(result.profileId);

      expect(result.preferences.colors.foreground).toBe("#ffffff");
      expect(result.preferences.colors.background).toBe("#000000");
    });
  });

  describe("getProfile", () => {
    it("作成済みプロフィールを取得できる", async () => {
      const created = await createProfile(validInput);
      createdIds.push(created.profileId);

      const result = await getProfile(created.profileId);
      expect(result.profileId).toBe(created.profileId);
      expect(result.nickname).toBe(created.nickname);
    });

    it("存在しないIDで404エラーを投げる", async () => {
      await expect(getProfile("mym-notfound")).rejects.toThrow(
        "プロフィールが見つかりません",
      );
    });
  });

  describe("updateProfile", () => {
    it("nicknameのみ更新できる", async () => {
      const created = await createProfile(validInput);
      createdIds.push(created.profileId);

      const updated = await updateProfile(created.profileId, {
        nickname: "更新後の名前",
      });
      expect(updated.nickname).toBe("更新後の名前");
      expect(updated.preferences).toEqual(created.preferences);
    });

    it("preferencesのみ更新できる", async () => {
      const created = await createProfile(validInput);
      createdIds.push(created.profileId);

      const newPreferences = {
        typography: {
          fontFamily: "serif",
          fontSize: 32,
          fontWeight: 400,
          lineHeight: 2.0,
        },
        colors: {
          foreground: "#000000",
          background: "#FFFFFF",
        },
      };
      const updated = await updateProfile(created.profileId, {
        preferences: newPreferences,
      });
      expect(updated.preferences.typography.fontFamily).toBe("serif");
      expect(updated.preferences.typography.fontSize).toBe(32);
      expect(updated.accessibility_thresholds.wcagLevel).toBe("AAA");
    });

    it("更新時にupdatedAtが変わる", async () => {
      const created = await createProfile(validInput);
      createdIds.push(created.profileId);

      // 少し待ってから更新
      await new Promise((resolve) => setTimeout(resolve, 50));
      const updated = await updateProfile(created.profileId, {
        nickname: "時間テスト",
      });
      expect(updated.metadata.updatedAt).not.toBe(created.metadata.updatedAt);
    });

    it("存在しないIDで404エラーを投げる", async () => {
      await expect(
        updateProfile("mym-notfound", { nickname: "テスト" }),
      ).rejects.toThrow("プロフィールが見つかりません");
    });
  });

  describe("deleteProfile", () => {
    it("プロフィールを削除できる", async () => {
      const created = await createProfile(validInput);

      await deleteProfile(created.profileId);

      await expect(getProfile(created.profileId)).rejects.toThrow(
        "プロフィールが見つかりません",
      );
    });

    it("存在しないIDで404エラーを投げる", async () => {
      await expect(deleteProfile("mym-notfound")).rejects.toThrow(
        "プロフィールが見つかりません",
      );
    });
  });
});
