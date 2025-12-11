/* APP */
import { createCustomerIdByUserId, getUserInformationByUserId } from "db";
import { stripe } from "./stripe";

export const createOrGetCustomerIdByUserId = async (userId: string) => {
  const user = await getUserInformationByUserId(userId);

  if (!user) throw new Error("User Record not found");

  if (user.customerId) return user.customerId;

  const customer = await stripe.customers.create({ email: user.email, metadata: { userId } });

  await createCustomerIdByUserId(customer.id, userId);

  return customer.id;
};
