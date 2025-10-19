import {db} from "../db";
import {product} from "../schemas/product";
import {and, asc, count, desc, eq, ilike, gte, lte} from "drizzle-orm";
import {Product} from "@shared-types/db";
import type {GI_GL} from "@shared-types/global";

export async function getAllProducts(options?: {
  filters?: Partial<Pick<Product, "name_de" | "name_ru" | "name_en"> & GI_GL>;
  page?: number;
  pageSize?: number;
  orderBy?: {
    field: keyof typeof product;
    direction?: "asc" | "desc";
  };
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  productList: Product[];
}> {
  const {filters, page = 1, pageSize = 20, orderBy} = options || {};
  const conditions = [];

  if (filters?.name_de) {
    conditions.push(ilike(product.name_de, `%${filters.name_de}%`));
  }

  if (filters?.name_en) {
    conditions.push(ilike(product.name_en, `%${filters.name_en}%`));
  }

  if (filters?.name_ru) {
    conditions.push(ilike(product.name_ru, `%${filters.name_ru}%`));
  }

  if (filters?.g_index_min !== undefined) {
    conditions.push(gte(product.g_index, filters.g_index_min));
  }

  if (filters?.g_index_max !== undefined) {
    conditions.push(lte(product.g_index, filters.g_index_max));
  }

  if (filters?.g_load_min !== undefined) {
    conditions.push(gte(product.g_load, filters.g_load_min));
  }

  if (filters?.g_load_max !== undefined) {
    conditions.push(lte(product.g_load, filters.g_load_max));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  // 🔢 Получаем общее количество
  const totalResult = await db.select({count: count()}).from(product).where(whereClause);

  const total = Number(totalResult[0]?.count ?? 0);

  let query = db.select().from(product);

  if (whereClause) {
    query = query.where(whereClause);
  }

  if (orderBy?.field) {
    const direction = orderBy.direction === "desc" ? desc(product[orderBy.field]) : asc(product[orderBy.field]);
    query = query.orderBy(direction);
  }

  query = query.limit(pageSize).offset((page - 1) * pageSize);

  const productList = await query;

  return {
    total,
    page,
    pageSize,
    productList,
  };
}
