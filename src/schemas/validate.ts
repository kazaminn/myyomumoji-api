import { z } from "zod";
import { hexColorSchema } from "@/schemas/common";

const VALID_FONT_WEIGHTS = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

const colorPairSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  foreground: hexColorSchema,
  background: hexColorSchema,
});

export const batchRequestSchema = z.object({
  colors: z.array(colorPairSchema).min(1).max(50),
  fontSize: z.number().min(1).max(999).default(16),
  fontWeight: z
    .number()
    .refine(
      (v): v is (typeof VALID_FONT_WEIGHTS)[number] =>
        (VALID_FONT_WEIGHTS as readonly number[]).includes(
          v
        ),
      "有効なフォントウェイト（100〜900、100刻み）を指定してください"
    )
    .default(400),
});

export type BatchRequest = z.infer<typeof batchRequestSchema>;
