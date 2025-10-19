import {Router} from "express";
import {getAllProducts} from "db/src/lib/products";
import {product} from "db";

const router = Router();

router.get("/api/products", async (req, res) => {
  try {
    const {
      page = "1",
      pageSize = "20",
      name_de,
      name_ru,
      name_en,
      g_index,
      g_load,
      orderByField,
      orderByDirection
    } = req.query;

    const filters = {
      name_de, name_ru, name_en, g_index, g_load
    };

    const orderBy = orderByField
      ? {
        field: orderByField as keyof typeof product,
        direction: orderByDirection === "asc" ? "asc" : "desc",
      }
      : undefined;

    const products = await getAllProducts({
      filters,
      page: Number(page),
      pageSize: Number(pageSize),
      orderBy,
    });

    res.json(products);
  } catch (err) {
    console.error("Ошибка при получении продуктов:", err);
    res.status(500).json({error: "Не удалось получить продукты"});
  }
});

function parseBoolean(value: unknown): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export {router as productsRouter};
