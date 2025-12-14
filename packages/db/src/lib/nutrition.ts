import OpenAI from "openai";
import { db } from "../db";
import { product } from "../schemas/product";
import { or, and, asc, count, desc, between, ilike, gte, lte, eq } from "drizzle-orm";
import { Product } from "@shared-types/db";

const openai = new OpenAI({
  apiKey: "", // process.env.OPENAI_API_KEY!,
});

export async function getRecommendation({ selectedProduct = "", goal = "" }) {
  const conditions = [];
  const nameConditions = [];

  const nameFields: (keyof Pick<Product, "name_de" | "name_en" | "name_ru">)[] = ["name_de", "name_en", "name_ru"];

  for (const field of nameFields) {
    nameConditions.push(ilike(product[field], `%${selectedProduct.trim()}%`));
  }

  if (nameConditions.length > 0) {
    conditions.push(or(...nameConditions));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const products = await db.select().from(product).where(whereClause);

  // Формируем список для prompt
  const productList = products.map((p) => `${p.name_en || p.name_de} (GI: ${p.g_index}, GL: ${p.g_load})`).join(", ");

  // Prompt для LLM
  const prompt = `
      Ты — эксперт по питанию и здоровью.
      Пользователь выбрал следующие продукты: ${productList}.
      Его цель: ${goal || "сбалансировать питание"}.

      На основе гликемического индекса и нагрузки:
      1. Оцени общую сбалансированность.
      2. Укажи, какие продукты лучше ограничить или заменить.
      3. Предложи комбинации продуктов для улучшения усвоения и снижения GI/GL.
      4. Дай короткий общий совет (в 2–3 предложениях).

      Ответ предоставь кратко, структурированно и на русском языке.
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  console.log("recommendation", completion);

  return { recommendation: completion.choices[0].message.content };
}
