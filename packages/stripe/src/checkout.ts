import { stripe } from "./stripe";
import { config } from "config";

export const checkout = async ({ priceId, customerId }: { priceId: string; customerId: string }) => {
  return await stripe.checkout.sessions.create({
    // Payment Mode
    mode: "subscription",
    // Product
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    expand: ["line_items"],
    // Redirect URL's
    success_url: `${process.env.FRONTEND_URL}${config.stripe.success_payment_url}`,
    cancel_url: `${process.env.FRONTEND_URL}${config.stripe.cancel_payment_url}`,
    //Customer
    customer: customerId,
    //Payment Options
    allow_promotion_codes: true,
    payment_method_types: ["card"],
    billing_address_collection: "required",
  });
};
