import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscription } from "../schemas/subscription";
import { user } from "../schemas/user";

export const createOrUpdateUserToFreePlan = async (userId: string) => {
  const existing = await db.select().from(subscription).where(eq(subscription.userId, userId)).limit(1);

  if (existing.length === 0) {
    await db.insert(subscription).values({
      userId,
      planId: "free",
      usage: 0,
      status: "",
    });
  } else {
    await db.update(subscription).set({ planId: "free" }).where(eq(subscription.userId, userId));
  }
};

export const getUserInformationByUserId = async (userId: string) => {
  let subscriptionDB = await db.select().from(subscription).innerJoin(user, eq(subscription.userId, userId)).where(eq(subscription.userId, userId));

  const record = subscriptionDB[0];

  if (!record) return null;

  return {
    id: record.user.id,
    email: record.user.email,
    customerId: record.subscription.customerId,
  };
};

export const createCustomerIdByUserId = async (customerId: string, userId: string) => {
  await db.update(subscription).set({ customerId }).where(eq(subscription.userId, userId));
};

export const getUserInformationByCustomerId = async (customerId: string) => {
  const subscriptionDB = await db
    .select()
    .from(subscription)
    .innerJoin(user, eq(subscription.userId, user.id))
    .where(eq(subscription.customerId, customerId))
    .limit(1);

  const record = subscriptionDB[0];

  if (!record) return null;

  return {
    id: record.user.id,
    email: record.user.email,
    customerId: record.subscription.customerId,
  };
};

export const updateSubscriptionInformationByUserId = async (
  userId: string,
  data: {
    /* Optional attributes */
    planId?: string;
    status?: string;
    frequency?: string | null;
    billingCycleStart?: number | null;
    billingCycleEnd?: number | null;
    cancelAtPeriodEnd?: boolean | null;
    subscriptionId?: string | null;
  },
) => {
  await db.update(subscription).set(data).where(eq(subscription.userId, userId));
};
