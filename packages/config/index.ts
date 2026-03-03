export const config = {
  app: {
    name: "application",
    version: "",
  },
  auth: {
    cookiePrefix: "auth",
  },
  url: {
    api: "http://localhost:8080",
    app: "http://localhost:5173",
  },
  stripe: {
    success_payment_url: "/settings/billing",
    cancel_payment_url: "/settings/billing",
    billing: "/settings/billing",
  },
};
