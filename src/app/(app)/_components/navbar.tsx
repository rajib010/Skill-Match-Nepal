"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Briefcase } from "lucide-react";
import UserImage from "@/app/(authenticated)/dashboard/_components/user-image";
import { toast } from "sonner";
import { signOut } from "@/lib/auth/client";
import { useUser } from "@/context/useUser";
import Logo from "./logo";
import { useState } from "react";
import { AlertModal } from "@/app/(authenticated)/dashboard/_components/alert-modal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const isActive = (path: string) => pathname === path;

  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <Logo logoClass="text-white" textClass="text-black" />

              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-6">
                {[
                  { href: "/", label: "Home" },
                  { href: "/jobs", label: "Jobs" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={` font-medium transition-colors hover:text-primary ${
                      isActive(href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <UserImage />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="center" className="w-44">
                    <DropdownMenuItem asChild>
                      <Link
                        href={isAdmin ? "/dashboard" : "/profile"}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        View {isAdmin ? "Dashboard" : "Profile"}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    {!isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href={"/jobs/applied"} className="cursor-pointer">
                          <Briefcase /> <span className="ml-2">Applied Jobs</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => setShowAlert((p) => !p)}
                      className="text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="hidden md:inline-flex"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showAlert && user && (
        <AlertModal
          action={async () => {
            await signOut();
            toast.success("Logged out successfully.");
            setShowAlert(false);
            router.replace("/login");
          }}
          open={showAlert}
          onOpenChange={() => setShowAlert((p) => !p)}
          mainText="Are you sure you want to logout?"
          description=""
        />
      )}
    </>
  );
}
