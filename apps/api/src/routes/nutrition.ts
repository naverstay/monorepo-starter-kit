import {Router} from "express";
import {getRecommendation} from "db/src/lib/nutrition";

const router = Router();

router.get("/api/nutrition", async (req, res) => {
  try {
    const {
      ids,
      goal,
      g_index_min,
      g_load_min,
      g_index_max,
      g_load_max
    } = req.query;

    const param = {
      ids: ids?.length && typeof ids === 'string' ? [ids] : [],
      g_index_min: Number(g_index_min) || 0,
      g_load_min: Number(g_load_min) || 0,
      g_index_max: Number(g_index_max) || 0,
      g_load_max: Number(g_load_max) || 0,
      goal: String(goal || ""),
    }

    console.log('getRecommendation', ids, param);

    const {recommendation} = await getRecommendation(param);

    res.json({recommendation});
  } catch (error) {
    console.error("Ошибка рекомендаций:", error);
    res.status(500).json({errorMsg: "Ошибка при получении рекомендаций", error});
  }
});

export {router as nutritionRouter};
