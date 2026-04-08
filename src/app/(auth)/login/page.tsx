"use client";

import {
  sendVerificationEmail,
  signIn,
  signInWithGoogle,
} from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, Shield, Users, Zap } from "lucide-react";
import { AuthSidePanel } from "@/components/auth/AuthSidePanel";
import Image from "next/image";
import logo from "../../../../public/logo.svg"

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (from === "verification-email") {
      toast.success("Thank you for verifying your email. You can now log in.");
    }
    router.replace(window.location.pathname);
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const { error } = await signIn({
      email: form.get("email") as string,
      password: form.get("password") as string,
      rememberMe: form.get("remember-me") === "on" ? true : false,
    });

    setLoading(false);

    if (error?.code === "EMAIL_NOT_VERIFIED") {
      setError("Your email is not verified. Please check your inbox.");
      sendVerificationEmail({ email: form.get("email") as string });
      return;
    }

    if (error) {
      setError(error.message || "An error occurred");
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle("/");
      // Redirect will be handled by Better Auth
    } catch {
      setGoogleLoading(false);
      setError("Failed to sign in with Google. Please try again.");
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <AuthSidePanel
                type="login"
                features={[
                  {
                    icon: Shield,
                    title: "Secure & Private",
                    description:
                      "Your data is encrypted and protected with industry-standard security.",
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description:
                      "Access your dashboard instantly with our optimized platform.",
                  },
                  {
                    icon: Users,
                    title: "Trusted by Thousands",
                    description:
                      "Join our growing community of satisfied users.",
                  },
                ]}
              />
              <form onSubmit={handleSubmit} className="p-6 md:p-8 w-full">
                <FieldGroup>
                  <div className="flex flex-col gap-2 text-center items-center">
                    <Image src={logo} alt="skill match logo" width={300} height={100}/>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </Field>

                  <div className="flex items-center space-x-2 my-1">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-sm text-muted-foreground"
                    >
                      Remember me
                    </label>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                      {error}
                    </div>
                  )}

                  <Field>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                  </Field>

                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>

                  <Field>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={googleLoading}
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="w-5 h-5"
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.84-6.84C35.67 2.82 30.25 0 24 0 14.64 0 6.48 5.34 2.45 13.09l7.98 6.19C12.05 13.6 17.56 9.5 24 9.5z"
                        />
                        <path
                          fill="#34A853"
                          d="M46.98 24.55c0-1.62-.15-3.18-.42-4.68H24v9.09h12.94c-.56 2.91-2.26 5.38-4.76 7.04l7.32 5.67c4.27-3.94 6.48-9.74 6.48-17.12z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.43 28.36a14.53 14.53 0 0 1-.77-4.36c0-1.51.27-2.97.77-4.36l-7.98-6.19A23.898 23.898 0 0 0 0 24c0 3.89.93 7.58 2.45 10.55l7.98-6.19z"
                        />
                        <path
                          fill="#4285F4"
                          d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.32-5.67c-2.03 1.36-4.63 2.16-7.81 2.16-6.44 0-11.95-4.1-14.57-9.8l-7.98 6.19C6.48 42.66 14.64 48 24 48z"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium text-sm">
                        Sign in with Google
                      </span>
                    </Button>
                  </Field>

                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="underline underline-offset-2"
                    >
                      Sign up
                    </Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
