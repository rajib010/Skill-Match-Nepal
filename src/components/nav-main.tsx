"use client";

import { IconLogout, type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertModal } from "@/app/(authenticated)/dashboard/_components/alert-modal";
import { signOut } from "@/lib/auth/client";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-1">
          <SidebarMenu>
            {items.map((item) => {
              //  Logout logic
              if (item.title === "Logout") {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip="Logout"
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2  rounded-md hover:bg-muted transition-colors my-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 w-full ">
                        <IconLogout size={18} />
                        <span className="font-[500]">Logout</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              // Active state handling
          const isActive =
            item.url === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.url || pathname.startsWith(item.url + "/");


              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium cursor-pointer",
                        isActive
                          ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                          : "bg-transparent"
                      )}
                    >
                      {item.icon && <item.icon size={18} />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {showModal && (
        <AlertModal
          mainText="Are you sure to logout?"
          open={showModal}
          onOpenChange={setShowModal}
          description="You'll be redirected to the login page and need to login to access again."
          action={async () => {
            await signOut();
            router.push("/login");
          }}
        />
      )}
    </>
  );
}
