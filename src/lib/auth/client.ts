import { APP_URL } from "@/config";
import { admin, customer, ac, centerOwner, teacher } from "@/lib/auth/access";
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        customer,
        centerOwner,
        teacher,
      },
    }),
  ],
});

export const {
  resetPassword,
  changePassword,
  signOut,
  sendVerificationEmail,
  forgetPassword,
  accountInfo,
  useSession,
} = authClient;

export const signIn = authClient.signIn.email;

export const signUp = authClient.signUp.email;

export const signInWithGoogle = async (callbackURL: string = "/") => {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
};

export const isAuthenticated = () =>
  authClient.getSession().then((session) => !!session.data?.user);

export const getSignedInUser = async () => {
  const session = await authClient.getSession();

  if (session.error) {
    if (process.env.NODE_ENV === "development") {
      console.error(session.error);
    }

    throw new Error("User is not signed in");
  }

  if (!session.data?.user) {
    throw new Error("User is not signed in");
  }

  return session.data.user;
};
