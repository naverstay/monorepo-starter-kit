import { db } from "../db";
import { user } from "../schemas/user";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import type { User } from "@shared-types/db";
import type { SortOption } from "@shared-types/global";

type TableFilter = Partial<Pick<User, "email" | "name" | "role" | "banned" | "isAnonymous">>;

export async function getAllUsers(options?: {
  filters?: TableFilter;
  page?: number;
  pageSize?: number;
  orderBy?: SortOption<TableFilter> | undefined;
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  userList: User[];
}> {
  const { filters, page = 1, pageSize = 20, orderBy } = options || {};
  const conditions = [];

  if (filters?.email) {
    conditions.push(ilike(user.email, `%${filters.email}%`));
  }

  if (filters?.name) {
    conditions.push(ilike(user.name, `%${filters.name}%`));
  }

  if (filters?.role) {
    conditions.push(eq(user.role, filters.role));
  }

  if (typeof filters?.banned === "boolean") {
    conditions.push(eq(user.banned, filters.banned));
  }

  if (typeof filters?.isAnonymous === "boolean") {
    conditions.push(eq(user.isAnonymous, filters.isAnonymous));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  // 🔢 Получаем общее количество
  const totalResult = await db.select({ count: count() }).from(user).where(whereClause);

  const total = Number(totalResult[0]?.count ?? 0);

  let sorted = undefined;
  let query = db.select().from(user).where(whereClause);

  if (orderBy?.field) {
    const direction = orderBy.direction === "desc" ? desc(user[orderBy.field]) : asc(user[orderBy.field]);
    sorted = query.orderBy(direction);
  }

  const userList = await (sorted ? sorted : query).limit(pageSize).offset((page - 1) * pageSize);

  return {
    total,
    page,
    pageSize,
    userList,
  };
}
