import {db} from "../db";
import {product} from "../schemas/product";
import {or, and, asc, count, desc, between, ilike, gte, lte} from "drizzle-orm";
import {Product} from "@shared-types/db";
import {GI_GL, SortOption} from "@shared-types/global";

type TableFilter = Partial<Pick<Product, "name_de" | "name_ru" | "name_en"> & GI_GL>;

export async function getAllProducts(options?: {
  filters?: TableFilter;
  page?: number;
  pageSize?: number;
  orderBy?: SortOption<TableFilter>;
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  productList: Product[];
}> {
  const {filters, page = 1, pageSize = 20, orderBy} = options || {};
  const {
    g_index_min = 0,
    g_index_max = 120,
    g_load_min = 0,
    g_load_max = 100,
    ...restFilters
  } = filters || {};

  const conditions = [];
  const nameConditions = [];

  const nameFields: (keyof Pick<Product, "name_de" | "name_en" | "name_ru">)[] = [
    "name_de",
    "name_en",
    "name_ru",
  ];

  for (const field of nameFields) {
    const value = restFilters?.[field];
    if (typeof value === "string" && value.trim()) {
      nameConditions.push(ilike(product[field], `%${value.trim()}%`));
    }
  }

  if (nameConditions.length > 0) {
    conditions.push(or(...nameConditions));
  }

  if (g_index_min !== undefined && g_index_max !== undefined) {
    conditions.push(between(product.g_index, g_index_min, g_index_max));
  } else {
    if (g_index_min !== undefined) {
      conditions.push(gte(product.g_index, g_index_min));
    }
    if (g_index_max !== undefined) {
      conditions.push(lte(product.g_index, g_index_max));
    }
  }

  if (g_load_min !== undefined && g_load_max !== undefined) {
    conditions.push(between(product.g_load, g_load_min, g_load_max));
  } else {
    if (g_load_min !== undefined) {
      conditions.push(gte(product.g_load, g_load_min));
    }
    if (g_load_max !== undefined) {
      conditions.push(lte(product.g_load, g_load_max));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const totalResult = await db
    .select({count: count()})
    .from(product)
    .where(whereClause);

  const total = Number(totalResult[0]?.count ?? 0);

  // console.log('total conditions', total, filters, restFilters);

  let query = db.select().from(product);

  if (whereClause) {
    query = query.where(whereClause);
  }

  if (orderBy?.field) {
    const direction =
      orderBy.direction === "desc"
        ? desc(product[orderBy.field])
        : asc(product[orderBy.field]);
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
