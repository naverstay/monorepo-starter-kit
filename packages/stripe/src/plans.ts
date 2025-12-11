export const plans = [
  {
    type: "subscription",
    name: "free",
    description: "ideal for anyone",
    features: [
      {
        available: true,
        text: "",
      },
    ],
    isFree: true,
    isPopular: true,
    actionButton: "choose basic",
    prices: [
      {
        stripeId: "free",
        symbol: "$",
        amount: 10,
        text: "/month",
        type: "monthly",
      },
    ],
  },
] as const;

export const findPlanByStripeId = (stripeId: string) => {
  const plan = plans
    .map((plan) => {
      const price = plan.prices.find((price) => price.stripeId === stripeId);
      return price ? { name: plan.name, type: plan.type, price } : null;
    })
    .find((entry) => entry !== null);

  return plan;
};

export const findFreePlan = () => {
  const plan = plans
    .map((plan) => {
      const price = plan.prices.find((price) => price.stripeId === "free");
      return price ? { name: plan.name, type: plan.type, price } : null;
    })
    .find((entry) => entry !== null);

  return plan;
};
