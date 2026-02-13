import { hexColorSchema } from "@/schemas/common";
import { z } from "zod";

const VALID_FONT_WEIGHTS = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

const typographySchema = z.object({
  fontFamily: z
    .string()
    .min(1, "フォントファミリーを指定してください")
    .max(100, "フォントファミリーは100文字以内で指定してください"),
  fontSize: z
    .number()
    .min(8, "フォントサイズは8以上で指定してください")
    .max(128, "フォントサイズは128以下で指定してください"),
  fontWeight: z
    .number()
    .refine(
      (v): v is (typeof VALID_FONT_WEIGHTS)[number] =>
        (VALID_FONT_WEIGHTS as readonly number[]).includes(v),
      "有効なフォントウェイト（100〜900、100刻み）を指定してください",
    ),
  lineHeight: z
    .number()
    .min(1.0, "行間は1.0以上で指定してください")
    .max(3.0, "行間は3.0以下で指定してください"),
});

const colorsSchema = z.object({
  foreground: hexColorSchema,
  background: hexColorSchema,
});

const preferencesSchema = z.object({
  typography: typographySchema,
  colors: colorsSchema,
});

export const createProfileSchema = z.object({
  nickname: z
    .string()
    .min(1, "ニックネームを入力してください")
    .max(100, "ニックネームは100文字以内で入力してください"),
  preferences: preferencesSchema,
});

export const updateProfileSchema = z
  .object({
    nickname: z
      .string()
      .min(1, "ニックネームを入力してください")
      .max(100, "ニックネームは100文字以内で入力してください")
      .optional(),
    preferences: preferencesSchema.optional(),
  })
  .refine(
    (data) => data.nickname !== undefined || data.preferences !== undefined,
    "更新するフィールドを1つ以上指定してください",
  );

export const profileIdSchema = z
  .string()
  .regex(/^mym-[a-z0-9]{8}$/, "プロフィールIDの形式が不正です");

export type CreateProfileRequest = z.infer<typeof createProfileSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
