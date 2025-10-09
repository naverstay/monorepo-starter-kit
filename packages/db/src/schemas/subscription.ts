import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const subscription = pgTable("subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  planId: text("plan_id").notNull(),
  customerId: text("customer_id"),
  subscriptionId: text("subscription_id"),
  usage: integer("usage").notNull().default(0),
  frequency: text("frequency"),
  billingCycleStart: integer("billing_cycle_start"),
  billingCycleEnd: integer("billing_cycle_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  status: text("status").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* one-to-one */
export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}));
