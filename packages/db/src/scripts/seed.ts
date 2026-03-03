import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import schema from "../schemas/index";
import { seedProducts } from "../seeds/products";
import { seedUsers } from "../seeds/users";

// Import drizzle config to trigger environment loading
import "../../drizzle.config";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

console.log("🌱 Starting database seeding...");

async function run() {
  try {
    await seedUsers(db);
    console.log("✅ Users seeded successfully!");

    await seedProducts(db);
    console.log("✅ Products seeded successfully!");

    console.log("🌿 All seeding completed!");
  } catch (error) {
    console.error("❌ Database seeding failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run().then((r) => {
  console.log("Database seeding done");
});
