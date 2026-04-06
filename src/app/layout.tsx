import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/useUser";
import { getSignedInUser } from "@/lib/auth/server";
import ScrollToTop from "@/components/scroll-to-top";

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
        <ScrollToTop />
        <Toaster />
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
