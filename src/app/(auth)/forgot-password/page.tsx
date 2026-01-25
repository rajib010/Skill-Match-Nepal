"use client";

import { forgetPassword } from "@/lib/auth/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import logo from "../../../../public/logo.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm  space-y-5">
        <div>
          <Image alt="Skill Match" src={logo} className="mx-auto h-10 w-auto" />
          <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h2>
        </div>
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();

            setError("");
            setLoading(true);

            const form = new FormData(e.target as HTMLFormElement);

            const { error } = await forgetPassword({
              email: form.get("email") as string,
              redirectTo: "/reset-password",
            });

            setLoading(false);

            console.log("🚀 ~ ForgotPasswordPage ~ error:", error)
            if (error) {
              setError(error.message || "An error occurred");
              return;
            }

            toast.success(
              "If an account exists with the email address, you will receive a password reset link shortly. Please check your inbox and your spam folder."
            );
          }}
        >
          <div>
            <div className="col-span-2">
              <Input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                autoComplete="email"
                aria-label="Email address"
              />
            </div>
          </div>

          {error && <div className="text-sm/6 text-red-600">{error}</div>}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              Send Reset Link
            </Button>
          </div>
        </form>

        <p className="text-center text-sm/6 text-gray-500">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
