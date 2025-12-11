import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { schema as Db } from "../schemas/index";
import { user as DbUser } from "../schemas/user";

type UserInsert = typeof DbUser.$inferInsert;
/**
 * Seeds the database with test user accounts.
 */
export async function seedUsers(db: PostgresJsDatabase<typeof Db>) {
  console.log("Seeding users...");

  // Test user data with realistic names and email addresses
  const users: UserInsert[] = [
    { name: "Alice Johnson", role: "admin", email: "alice@example.com", emailVerified: true },
    { name: "Bob Smith", role: "moderator", email: "bob@example.com", emailVerified: true },
    {
      name: "Charlie Brown",
      role: "user",
      email: "charlie@example.com",
      emailVerified: false,
      banned: false,
      banReason: "Fake e-mail",
    },
    { name: "Diana Prince", role: "user", email: "diana@example.com", emailVerified: true },
    { name: "Eve Davis", role: "user", email: "eve@example.com", emailVerified: true },
    { name: "Frank Miller", role: "user", email: "frank@example.com", emailVerified: false },
    { name: "Grace Lee", role: "user", email: "grace@example.com", emailVerified: true },
    { name: "Henry Wilson", role: "user", email: "henry@example.com", emailVerified: true },
    { name: "Ivy Chen", role: "user", email: "ivy@example.com", emailVerified: false },
    { name: "Jack Thompson", role: "user", email: "jack@example.com", emailVerified: true },
  ];

  for (const user of users) {
    await db.insert(DbUser).values(user).onConflictDoNothing();
  }

  console.log(`✅ Seeded ${users.length} test users`);
}
