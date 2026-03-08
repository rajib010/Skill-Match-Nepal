"use client";

import React from "react";
import {
  IconHome,
  IconMessage2,
  IconSettings,
  IconUser,
  IconUserBitcoin,
  IconPhoneCall,
  IconNotification,
  IconBriefcase,
  IconCategory,
  IconMail,
  IconLoader2,
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
import logo from "../../public/logo.svg";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { constructUrl } from "@/lib/cloudinary/utils";
import { useUser } from "@/context/useUser";

export function AppSidebar({ ...props }) {
  const { user } = useUser();

  if (!user) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex h-[var(--header-height)] items-center justify-center">
                <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    );
  }

  const isAdmin = user.role === "admin";

  const profileImage = user.image && constructUrl(user.image);

  const hasProfileImage = profileImage?.trim() && profileImage !== null;

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Applications",
      url: "/dashboard/applications",
      icon: IconMail,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: IconCategory,
    },
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: IconBriefcase,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUserBitcoin,
    },
  ];

  const navPreferences = [
    {
      title: "Settings",
      url: "/dashboard/account",
      icon: IconSettings,
    },
    {
      title: "Logout",
      url: "",
    },
  ];

  const websiteInformation = [
    {
      title: "Contact",
      url: "/dashboard/contact",
      icon: IconPhoneCall,
    },
    {
      title: "FAQs",
      url: "/dashboard/faqs",
      icon: IconNotification,
    },
    {
      title: "Testimonial",
      url: "/dashboard/testimonials",
      icon: IconMessage2,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex h-[var(--header-height)] items-center px-4"
            >
              <Link href="/">
                <Image
                  src={logo}
                  alt="H-One logo"
                  className="max-h-[calc(var(--header-height)-1rem)] w-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* user information */}
          <SidebarMenuItem>
            <div className="mx-3 my-2 rounded-lg border bg-muted/50 p-3">
              <div className="flex items-start gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {hasProfileImage ? (
                    <Image
                      src={profileImage!}
                      alt={`${user.name} profile image`}
                      className="rounded-full"
                      fill
                      priority
                    />
                  ) : (
                    <IconUser className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Badge className="w-fit text-[10px] font-medium uppercase tracking-wide">
                    {user.role}
                  </Badge>
                  <span className="truncate text-sm font-semibold leading-none">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div>
          <span className="sidebar-header-text">MAIN MENU</span>
          <NavMain items={navMain} />
        </div>
        {isAdmin && (
          <div>
            <span className="sidebar-header-text">WEBSITE CONTENT</span>
            <NavMain items={websiteInformation} />
          </div>
        )}
        <div>
          <span className="sidebar-header-text">PREFERENCES</span>
          <NavMain items={navPreferences} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
