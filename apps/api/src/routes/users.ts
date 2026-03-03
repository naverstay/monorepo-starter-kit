import { Router } from "express";
import { getAllUsers } from "db/src/lib/users";
import { user } from "db";

const router = Router();

router.get("/api/users", async (req, res) => {
  try {
    const { page = "1", pageSize = "20", email, name, role, banned, isAnonymous, orderByField, orderByDirection } = req.query;

    const filters = {
      email,
      name,
      role,
      banned: parseBoolean(banned),
      isAnonymous: parseBoolean(isAnonymous),
    };

    const orderBy = orderByField
      ? {
          field: orderByField as keyof typeof user,
          direction: orderByDirection === "asc" ? "asc" : "desc",
        }
      : undefined;

    const users = await getAllUsers({
      filters,
      page: Number(page),
      pageSize: Number(pageSize),
      orderBy,
    });

    res.json(users);
  } catch (err) {
    console.error("Ошибка при получении пользователей:", err);
    res.status(500).json({ error: "Не удалось получить пользователей" });
  }
});

function parseBoolean(value: unknown): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export { router as usersRouter };
