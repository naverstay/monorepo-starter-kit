/* LIBRARIES */
import { fromPromise } from "neverthrow";
/* APP */
import { AppError } from "./error";

export const safeDbPromise = async <T>(query: Promise<T>) => {
  const dbPromise = await fromPromise(query, (error) => error);

  if (dbPromise.isErr()) {
    throw new AppError("internal_server_error", `Something was wrong. ${dbPromise.error}`);
  }

  return dbPromise.value;
};
