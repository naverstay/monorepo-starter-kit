import {Router} from "express";
import {getAllProducts} from "db/src/lib/products";
import {product} from "db";

const router = Router();

router.get("/api/products", async (req, res) => {
  try {
    const {
      page,
      pageSize,
      name_de,
      name_ru,
      name_en,
      g_index_min,
      g_index_max,
      g_load_min,
      g_load_max,
      orderByField,
      orderByDirection,
    } = req.query;

    const filters = {
      name_de,
      name_ru,
      name_en,
      g_index_min,
      g_index_max,
      g_load_min,
      g_load_max,
    };

    const orderBy = orderByField
      ? {
        field: orderByField as keyof typeof product,
        direction: orderByDirection === "asc" ? "asc" : "desc",
      }
      : undefined;

    console.log('pageSize', pageSize, req.query);

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

export {router as productsRouter};
