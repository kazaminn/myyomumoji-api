import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { batchRequestSchema } from "@/schemas/validate";
import { validateBatch } from "@/services/validator";
import type { ColorPair } from "@/types";

const validate = new Hono();

validate.post(
  "/batch",
  zValidator("json", batchRequestSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "入力値が不正です",
            details: result.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
        },
        400
      );
    }
  }),
  (c) => {
    const body = c.req.valid("json");

    const colors: ColorPair[] = body.colors.map(
      (pair, index) => ({
        id: pair.id ?? `pair-${index}`,
        foreground: pair.foreground,
        background: pair.background,
      })
    );

    const data = validateBatch(
      colors,
      body.fontSize,
      body.fontWeight
    );

    return c.json({ success: true, data });
  }
);

export default validate;
