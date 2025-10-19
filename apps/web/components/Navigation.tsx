/**
 * ProofOfFit Navigation Component (Next.js App Router)
 * Enhanced navigation with Logo branding and user menu
 * 
 * Location: apps/web/components/Navigation.tsx
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Briefcase, FileText, CreditCard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

interface ProfileData {
  displayName: string | null;
  role: string | null;
  avatarUrl: string | null;
}

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { path: "/jobs", label: "Browse Jobs", icon: Briefcase },
    { path: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  const userInitials = profile?.displayName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="hover-elevate rounded-lg px-2 py-1 -ml-2">
            <Logo size="sm" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant={isActive(link.path) ? "secondary" : "ghost"}
                  className={cn("gap-2", isActive(link.path) && "no-default-hover-elevate")}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu / Auth */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="gap-2 hover-elevate"
                        data-testid="button-user-menu"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatarUrl || undefined} />
                          <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:inline">{profile?.displayName || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{profile?.displayName || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <Link href="/dashboard">
                        <DropdownMenuItem data-testid="menu-dashboard">
                          <FileText className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/profile">
                        <DropdownMenuItem data-testid="menu-profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      {profile?.role === "employer" && (
                        <Link href="/employer">
                          <DropdownMenuItem data-testid="menu-employer">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Employer Dashboard
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="text-destructive focus:text-destructive"
                        data-testid="menu-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex" data-testid="nav-button-login">
                    Log in
                  </Button>
                </Link>
                <Link href="/login">
                  <Button data-testid="nav-button-signup">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant={isActive(link.path) ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t space-y-2">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              {profile?.role === "employer" && (
                <Link href="/employer">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4" />
                    Employer Dashboard
                  </Button>
                </Link>
              )}
            </div>
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
