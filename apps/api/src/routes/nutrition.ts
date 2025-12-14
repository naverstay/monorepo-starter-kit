import { Router } from "express";
import { getRecommendation } from "db/src/lib/nutrition";

const router = Router();

router.post("/api/recommend", async (req, res) => {
  try {
    const { selectedProduct, goal } = req.body;

    const { recommendation } = await getRecommendation({ selectedProduct: "", goal: "" });

    res.json({ recommendation });
  } catch (error) {
    console.error("Ошибка рекомендаций:", error);
    res.status(500).json({ error: "Ошибка при получении рекомендаций" });
  }
});

export { router as nutritionRouter };
