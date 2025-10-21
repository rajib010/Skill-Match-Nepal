"use client";

import * as React from "react";
import {
  IconAnalyze,
  IconChalkboardTeacher,
  IconDeviceLaptop,
  IconSettings,
  IconUserBitcoin,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SignedInUser } from "@/lib/auth/server";
import logo from "../../public/logo.jpg";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: IconDeviceLaptop,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUserBitcoin,
    },
    {
      title: "Analytics",
      url: "/dashboard/follow-up",
      icon: IconAnalyze,
    },

  ],
  navPreferences: [
    {
      title: "Settings",
      url: "/dashboard/account",
      icon: IconSettings,
    },
    {
      title: "Logout",
      url: "",
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: SignedInUser;
};

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex h-[var(--header-height)] items-center justify-center px-4"
            >
              <Link href="/dashboard">
                <Image
                  src={logo}
                  alt="H-One logo"
                  className="max-h-[calc(var(--header-height)-1rem)] w-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div>
          <span className="sidebar-header-text">MAIN MENU</span>
          <NavMain items={data.navMain} />
        </div>
        <div>
          <span className="sidebar-header-text">PREFERENCES</span>
          <NavMain items={data.navPreferences} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
