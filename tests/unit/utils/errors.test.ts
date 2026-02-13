import { AppError, buildErrorResponse } from "@/utils/errors";
import { describe, expect, it } from "vitest";

describe("AppError", () => {
  it("code, message, statusCodeを保持する", () => {
    const error = new AppError("TEST_ERROR", "テストエラー", 400);
    expect(error.code).toBe("TEST_ERROR");
    expect(error.message).toBe("テストエラー");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("AppError");
  });

  it("statusCodeのデフォルト値は400", () => {
    const error = new AppError("TEST_ERROR", "テストエラー");
    expect(error.statusCode).toBe(400);
  });

  it("detailsを保持できる", () => {
    const details = [{ field: "name", message: "必須です" }];
    const error = new AppError("VALIDATION_ERROR", "不正", 400, details);
    expect(error.details).toEqual(details);
  });

  it("Errorを継承している", () => {
    const error = new AppError("TEST", "msg");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });
});

describe("buildErrorResponse", () => {
  it("エラーレスポンス形式に変換する", () => {
    const error = new AppError("NOT_FOUND", "見つかりません", 404);
    const response = buildErrorResponse(error);
    expect(response).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "見つかりません",
      },
    });
  });

  it("detailsがある場合は含める", () => {
    const details = [{ field: "email", message: "無効です" }];
    const error = new AppError("VALIDATION_ERROR", "不正", 400, details);
    const response = buildErrorResponse(error);
    expect(response.error.details).toEqual(details);
  });

  it("detailsがない場合は含めない", () => {
    const error = new AppError("ERROR", "エラー", 500);
    const response = buildErrorResponse(error);
    expect(response.error).not.toHaveProperty("details");
  });
});
