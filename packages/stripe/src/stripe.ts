import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil",
  appInfo: {
    name: process.env.APP_NAME ?? "",
    version: process.env.APP_VERSION ?? "1",
  },
});
