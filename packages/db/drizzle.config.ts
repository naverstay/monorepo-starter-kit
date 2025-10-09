import { defineConfig } from "drizzle-kit";

import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../apps/api/.env") });

const config = defineConfig({
  schema: ["./src/schemas/*.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});

export default config;
