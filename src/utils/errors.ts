export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
    public readonly details?: Array<{
      field: string;
      message: string;
    }>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function buildErrorResponse(error: AppError) {
  return {
    success: false as const,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    },
  };
}
