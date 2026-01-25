import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/useUser";
import { getSignedInUser } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Skill Match Nepal",
  description: "Find jobs based on your skills.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSignedInUser();
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster />
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
