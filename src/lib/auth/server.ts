import { APP_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV } from "@/config";
import { prisma } from "@/database/prisma";
import { admin, user, ac } from "@/lib/auth/access";
import { sendMail } from "@/lib/mailer";
import ResetPassword from "@/mail/auth/reset-password";
import VerifyEmail from "@/mail/auth/verify-email";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { headers } from "next/headers";

export const auth = betterAuth({
  baseURL: APP_URL,
  cookie: {
    secure: NODE_ENV === "production", //secure in prod
    sameSite: "lax",
    httpOnly: true,
  },
  plugins: [
    adminPlugin({
      defaultRole: "user",
      adminRoles: ["admin"],
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true, //set cookie immediately
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`Reset password url for ${user.email}: ${url}`);
      }

      await sendMail({
        to: user.email,
        subject: "Reset your password",
        content: {
          template: ResetPassword,
          props: {
            user: user.name,
            url,
          },
        },
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`Verification url for ${user.email}: ${url}`);
      }

      await sendMail({
        to: user.email,
        subject: "Verify your email",
        content: {
          template: VerifyEmail,
          props: {
            user: user.name,
            url,
          },
        },
      });
    },
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
    },
  },
});

export const isAuthenticated = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return !!session;
};

export const getSignedInUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
};

export type SignedInUser = Awaited<ReturnType<typeof getSignedInUser>>;
