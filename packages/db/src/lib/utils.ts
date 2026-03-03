import {between, gte, lte} from "drizzle-orm";

export function buildRangeConditions(column: any, min?: number, max?: number) {
  const result = [];

  if (min !== undefined && max !== undefined) {
    result.push(between(column, min, max));
  } else {
    if (min !== undefined) {
      result.push(gte(column, min));
    }
    if (max !== undefined) {
      result.push(lte(column, max));
    }
  }

  return result;
}
