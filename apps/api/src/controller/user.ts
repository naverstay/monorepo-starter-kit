/* LIBRARIES */
import { Request, Response } from "express";
/* APP */
import { userSchema } from "validator";
import { authentication } from "auth/server";
import { safeDbPromise, validatorDTO } from "validator";
import { updateUserInformationByUserId } from "db";

export const updateName = async (req: Request, res: Response) => {
  const auth = await authentication(req);
  const data = await validatorDTO(req, userSchema.updateName);

  await safeDbPromise(updateUserInformationByUserId(auth.user.id, { name: data.body.name }));

  return res.status(200).json();
};
