/* LIBRARIES */
import { Request } from "express";
import { AnyZodObject, z, ZodType } from "zod";
/* App */
import { AppError } from "./error";

export type InferSchemaValues<T extends ZodType<any>> = z.infer<T>;

export const validatorDTO = async <T extends AnyZodObject>(request: Request, schema: T): Promise<z.infer<T>> => {
  const result = await schema.safeParseAsync({
    body: request.body,
    params: request.params,
    query: request.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      code: issue.code.toUpperCase(),
      message: issue.message,
      path: issue.path.join("."),
    }));

    throw new AppError("validation_error", `${result.error.issues[0].message}. ${errors.map((e) => ` ${e.path}: ${e.message} / `)}`);
  }

  return result.data;
};
