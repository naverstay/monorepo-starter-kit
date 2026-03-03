import { config } from "config";
import { stripe } from "./stripe";

export const getBillingPortalByCustomerId = async (customerId: string) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}${config}`,
  });
};
