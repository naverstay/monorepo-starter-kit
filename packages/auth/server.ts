/* LIBRARIES */
import { Request } from "express";
import { betterAuth } from "better-auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db, createOrUpdateUserToFreePlan, verification, account, session, user } from "db";
import { config } from "config";
import { AppError } from "validator";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      /* NEEDED */
      verification,
      account,
      session,
      user,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  emailVerification: {
    expiresIn: 604_800, // ONE WEEK
    autoSignInAfterVerification: true,
  },
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          //Update user to free plan by default
          await createOrUpdateUserToFreePlan(user.id);
        },
      },
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL ?? ""],
  appName: process.env.APP_NAME ?? "",
  advanced: {
    cookiePrefix: config.auth.cookiePrefix,
  },
  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],
});

interface IUserBetterAuth {
  id: string;
  role?: string | null;
  email: string;
}

export const authHandler = toNodeHandler(auth);

export const authentication = async (req: Request, plugins: ((user: IUserBetterAuth) => Promise<void> | void)[] = []) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session || !session.user) {
    throw new AppError("unauthorized", "Please sign in to access the resource. You are not authorized! To continue, please sign in first");
  }

  if (plugins.length > 0) {
    for (const plugin of plugins) {
      await plugin(session.user);
    }
  }

  return {
    user: session.user,
  };
};
