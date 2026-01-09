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
import { User, LogOut } from "lucide-react";
import logo from "../../public/logo.svg";
import Image from "next/image";
import UserImage from "@/app/(authenticated)/dashboard/_components/UserImage";
import { isAuthenticated, signOut } from "@/lib/auth/client";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const isAuth = isAuthenticated()
  

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Skill Match logo"
                priority
                width={200}
                height={200}
              />
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { href: "/", label: "Home" },
                { href: "/jobs", label: "Jobs" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
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
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <UserImage />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      toast.success("Logged out successfully.");
                      router.replace("/login");
                    }}
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
  );
}
