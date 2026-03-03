import OpenAI from "openai";
import {db} from "../db";
import {product} from "../schemas/product";
import {and, ilike, or} from "drizzle-orm";
import {buildRangeConditions} from "./utils";

/**
 * Инициализация клиента OpenAI для работы с OpenRouter.
 * Мы используем стандартный SDK 'openai', так как он полностью совместим.
 */
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  // apiKey: process.env.OPENAI_API_KEY!,
  // defaultHeaders: {
  //   "HTTP-Referer": "http://localhost:3000", // Рекомендуется для OpenRouter
  //   "X-Title": "Nutrition Advisor App",       // Имя вашего приложения для логов
  // },
});

export async function getRecommendation(params: {
  ids: string[];
  g_index_min: number | undefined;
  g_load_min: number | undefined;
  g_index_max: number | undefined;
  g_load_max: number | undefined;
  goal: string;
}) {
  const {ids = [], g_index_min, g_load_min, g_index_max, g_load_max, goal} = params;

  try {
    if (ids?.length > 0) {
      const conditions = [];

      // 1. Поиск продуктов в базе данных через Drizzle ORM
      const idConditions = ids?.length ? ids?.map(id => ilike(product.id, `%${id}%`)) : [];
      const whereIds = idConditions.length > 0 ? or(...idConditions) : undefined;

      conditions.push(...buildRangeConditions(product.g_index, g_index_min, g_index_max));
      conditions.push(...buildRangeConditions(product.g_load, g_load_min, g_load_max));

      const whereGiGl = conditions.length > 0 ? and(...conditions) : undefined;

      const products = await db.select().from(product).where(whereIds);
      const productsData = await db.select().from(product) //.where(whereGiGl);

      // Если продукты не найдены, прерываем выполнение
      if (!productsData || productsData.length === 0) {
        return {recommendation: "Продукты не найдены. Пожалуйста, уточните запрос."};
      }

      // 2. Подготовка данных для LLM
      const productList = productsData
        .map((p, pi) => `${pi + 1}. id: ${p.id}, ${p.name_ru || p.name_en || p.name_de} (GI: ${p.g_index}, GL: ${p.g_load})`)
        .join(",\n");

      // 3. Формирование Промпта
      const prompt = `
Ты — эксперт по питанию и здоровью и работаешь только с продуктами из списка:
${productList}.

Пользователь выбрал продукт с id: ${ids}.
Его цель: ${goal || "сбалансировать питание"}.

На основе гликемического индекса (GI) и гликемической нагрузки (GL):
1. Оцени общую сбалансированность.
2. Укажи, какие продукты лучше подходят к выбранному с учетом того, что общий GI должен быть в диапазоне ${g_index_min}-${g_index_max}, а GL ${g_load_min}-${g_load_max}.
3. Предложи комбинации продуктов для улучшения усвоения и снижения GI/GL.
4. Дай короткий общий совет (в 2–3 предложениях).

Ответ предоставь кратко и на русском языке, id всех упомянутых в ответе продуктов помести в отдельный массив.
`;

      console.log('prompt', prompt);

      // 4. Запрос к OpenRouter
      // Используем актуальную бесплатную модель (можно менять на deepseek/deepseek-chat:free)
      const completion = await openai.chat.completions.create({
        // model: "gpt-4o-mini",
        model: "arcee-ai/trinity-large-preview:free",
        // model: "google/gemini-2.0-flash-exp:free",
        // model: "google/gemma-3-27b-it:free", // 1
        // model: "upstage/solar-pro-3:free", // 1
        // model: "mistralai/mistral-small-3.1-24b-instruct:free",
        // model: "nousresearch/hermes-3-llama-3.1-405b:free",
        // model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [{role: "user", content: prompt}],
        stream: false,
      });

      console.log('completion', completion);

      // 5. Извлечение ответа
      const recommendation = completion.choices[0]?.message?.content;

      if (!recommendation) {
        throw new Error("Empty response from AI");
      }

      return {recommendation};
    } else {
      return {recommendation: "Не выбран продукт для подбора"};
    }
  } catch (error: any) {
    console.error("OpenRouter Error:", error);

    // Обработка типичных ошибок API
    if (error.status === 401) return {recommendation: "Ошибка авторизации: проверьте API-ключ."};
    if (error.status === 404) return {recommendation: "Ошибка: выбранная модель временно недоступна."};
    if (error.status === 429) return {recommendation: "Лимит запросов исчерпан. Попробуйте позже."};

    return {recommendation: "Произошла ошибка при получении рекомендаций. Попробуйте позже."};
  }
}
