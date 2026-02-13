import type { Context } from "hono";
import {
  AppError,
  buildErrorResponse,
} from "@/utils/errors";

export function errorHandler(err: Error, c: Context) {
  if (err instanceof AppError) {
    return c.json(
      buildErrorResponse(err),
      err.statusCode as 400
    );
  }

  console.error("Unexpected error:", err);

  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "サーバー内部エラーが発生しました",
      },
    },
    500
  );
}
