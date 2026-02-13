import {
  createProfileSchema,
  profileIdSchema,
  updateProfileSchema,
} from "@/schemas/profile";
import { describe, expect, it } from "vitest";

const validPreferences = {
  typography: {
    fontFamily: "sans-serif",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  colors: {
    foreground: "#FFFFFF",
    background: "#000000",
  },
};

describe("createProfileSchema", () => {
  it("有効なリクエストを受け入れる", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト設定",
      preferences: validPreferences,
    });
    expect(result.success).toBe(true);
  });

  it("nicknameが空の場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "",
      preferences: validPreferences,
    });
    expect(result.success).toBe(false);
  });

  it("nicknameが100文字を超える場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "あ".repeat(101),
      preferences: validPreferences,
    });
    expect(result.success).toBe(false);
  });

  it("preferencesが欠けている場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト",
    });
    expect(result.success).toBe(false);
  });

  it("fontSizeが8未満の場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト",
      preferences: {
        ...validPreferences,
        typography: { ...validPreferences.typography, fontSize: 7 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("fontSizeが128を超える場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト",
      preferences: {
        ...validPreferences,
        typography: { ...validPreferences.typography, fontSize: 129 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("fontWeightが100刻み以外の場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト",
      preferences: {
        ...validPreferences,
        typography: { ...validPreferences.typography, fontWeight: 450 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("有効なfontWeight値（100〜900）を全て受け入れる", () => {
    for (const weight of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      const result = createProfileSchema.safeParse({
        nickname: "テスト",
        preferences: {
          ...validPreferences,
          typography: { ...validPreferences.typography, fontWeight: weight },
        },
      });
      expect(result.success).toBe(true);
    }
  });

  it("lineHeightが1.0未満の場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト",
      preferences: {
        ...validPreferences,
        typography: { ...validPreferences.typography, lineHeight: 0.9 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("lineHeightが3.0を超える場合を拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト",
      preferences: {
        ...validPreferences,
        typography: { ...validPreferences.typography, lineHeight: 3.1 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("不正なHEXカラーを拒否する", () => {
    const result = createProfileSchema.safeParse({
      nickname: "テスト",
      preferences: {
        ...validPreferences,
        colors: { foreground: "red", background: "#000000" },
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("nicknameのみの更新を受け入れる", () => {
    const result = updateProfileSchema.safeParse({
      nickname: "新しい名前",
    });
    expect(result.success).toBe(true);
  });

  it("preferencesのみの更新を受け入れる", () => {
    const result = updateProfileSchema.safeParse({
      preferences: validPreferences,
    });
    expect(result.success).toBe(true);
  });

  it("nickname + preferencesの更新を受け入れる", () => {
    const result = updateProfileSchema.safeParse({
      nickname: "新しい名前",
      preferences: validPreferences,
    });
    expect(result.success).toBe(true);
  });

  it("空オブジェクトを拒否する（更新フィールドなし）", () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("profileIdSchema", () => {
  it("有効なプロフィールIDを受け入れる", () => {
    expect(profileIdSchema.safeParse("mym-abc12345").success).toBe(true);
    expect(profileIdSchema.safeParse("mym-00000000").success).toBe(true);
    expect(profileIdSchema.safeParse("mym-zzzzzzzz").success).toBe(true);
  });

  it("プレフィックスなしのIDを拒否する", () => {
    expect(profileIdSchema.safeParse("abc12345").success).toBe(false);
  });

  it("大文字を含むIDを拒否する", () => {
    expect(profileIdSchema.safeParse("mym-ABC12345").success).toBe(false);
  });

  it("長さが不正なIDを拒否する", () => {
    expect(profileIdSchema.safeParse("mym-abc1234").success).toBe(false);
    expect(profileIdSchema.safeParse("mym-abc123456").success).toBe(false);
  });

  it("特殊文字を含むIDを拒否する", () => {
    expect(profileIdSchema.safeParse("mym-abc1234!").success).toBe(false);
  });
});
