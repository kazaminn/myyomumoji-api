import {
  createProfileSchema,
  profileIdSchema,
  updateProfileSchema,
} from "@/schemas/profile";
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "@/services/profile";
import { AppError } from "@/utils/errors";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const profiles = new Hono();

function validationErrorResponse(
  result: {
    success: false;
    error: { issues: Array<{ path: (string | number)[]; message: string }> };
  },
  c: { json: (body: unknown, status: number) => Response },
) {
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
    400,
  );
}

function validateProfileId(id: string): void {
  const result = profileIdSchema.safeParse(id);
  if (!result.success) {
    throw new AppError(
      "INVALID_PROFILE_ID",
      "プロフィールIDの形式が不正です",
      400,
    );
  }
}

profiles.post(
  "/",
  zValidator("json", createProfileSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(result, c);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const data = await createProfile(body);
    return c.json({ success: true, data }, 201);
  },
);

profiles.get("/:id", async (c) => {
  const id = c.req.param("id");
  validateProfileId(id);
  const data = await getProfile(id);
  return c.json({ success: true, data });
});

profiles.patch(
  "/:id",
  zValidator("json", updateProfileSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(result, c);
    }
  }),
  async (c) => {
    const id = c.req.param("id");
    validateProfileId(id);
    const body = c.req.valid("json");
    const data = await updateProfile(id, body);
    return c.json({ success: true, data });
  },
);

profiles.delete("/:id", async (c) => {
  const id = c.req.param("id");
  validateProfileId(id);
  await deleteProfile(id);
  return c.json({ success: true, data: null });
});

export default profiles;
