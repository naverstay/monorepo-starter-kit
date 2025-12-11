import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(1, "Name is required").max(32, "Name must be less than 32 characters"),
});

export const userSchema = {
  updateName: z.object({
    body: z.object({
      name: schema.shape.name,
    }),
  }),
};
