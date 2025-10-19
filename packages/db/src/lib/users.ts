import {db} from "../db";
import {user} from "../schemas/user";
import {and, asc, count, desc, eq, ilike} from "drizzle-orm";
import {User} from "@shared-types/db";

export async function getAllUsers(options?: {
  filters?: Partial<Pick<User, "email" | "name" | "role" | "banned" | "isAnonymous">>;
  page?: number;
  pageSize?: number;
  orderBy?: {
    field: keyof typeof user;
    direction?: "asc" | "desc";
  };
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  userList: User[];
}> {
  const {filters, page = 1, pageSize = 20, orderBy} = options || {};
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
  const totalResult = await db.select({count: count()}).from(user).where(whereClause);

  const total = Number(totalResult[0]?.count ?? 0);

  let query = db.select().from(user);

  if (whereClause) {
    query = query.where(whereClause);
  }

  if (orderBy?.field) {
    const direction = orderBy.direction === "desc" ? desc(user[orderBy.field]) : asc(user[orderBy.field]);
    query = query.orderBy(direction);
  }

  query = query.limit(pageSize).offset((page - 1) * pageSize);

  const userList = await query;

  return {
    total,
    page,
    pageSize,
    userList,
  };
}
