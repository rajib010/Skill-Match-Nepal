import { getSignedInUser, isAuthenticated } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./dashboard.css";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const userData = await getSignedInUser();

  if (userData.role !== "admin") {
    redirect("/");
  }

  const user: User = {
    ...userData,
    image: userData.image ?? undefined,
    role: (userData.role ?? "user") as "user" | "admin",
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
