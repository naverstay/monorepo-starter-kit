/* Libraries */
import { NextFunction, Request, Response } from "express";

export const APP_ERROR_CODES_BY_KEY = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  internal_server_error: 500,
  application_error: 500,
  conflict: 409,
  bad_request: 400,
  invalid_access: 422,
  invalid_parameter: 422,
  invalid_region: 422,
  rate_limit_exceeded: 429,
  validation_error: 403,
  method_not_allowed: 405,
} as const;

export type APP_ERROR_CODE_KEY = keyof typeof APP_ERROR_CODES_BY_KEY;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly name: APP_ERROR_CODE_KEY;

  constructor(name: APP_ERROR_CODE_KEY, message: string) {
    super();

    this.name = name;
    this.message = message;
    this.statusCode = APP_ERROR_CODES_BY_KEY[this.name];

    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public override toString() {
    return JSON.stringify(
      {
        message: this.message,
        name: this.name,
      },
      null,
      2,
    );
  }
}

export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(error);
    return;
  }

  const internalError = new AppError("internal_server_error", "Something went wrong. If the problem persist, contact with support.");

  res.status(internalError.statusCode).json(internalError);
  return;
};
