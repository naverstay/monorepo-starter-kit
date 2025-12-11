/* EXPRESS */
import { Router } from "express";
import * as userController from "@/controller/user";

const router = Router();

router.put("/user/update:name", userController.updateName);

export { router as userRouter };
