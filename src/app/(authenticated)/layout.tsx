import { getSignedInUser, isAuthenticated } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./dashboard.css";
import { UserProvider } from "@/providers/UserProvider";

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

  return (
    <UserProvider user={userData}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="sticky min-w-[200] top-0 z-10 bg-background border-b">
            <SiteHeader />
          </div>
          <div className="p-4 min-h-screen">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
