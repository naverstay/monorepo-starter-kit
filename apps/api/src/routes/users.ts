import { Router } from "express";
import { getAllUsers } from "db/src/lib/users";

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Ошибка при получении пользователей:", err);
    res.status(500).json({ error: "Не удалось получить пользователей" });
  }
});

export { router as usersRouter };
