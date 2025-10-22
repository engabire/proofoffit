"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@proof-of-fit/ui";
import {
  BookOpen,
  ChevronDown,
  DollarSign,
  ExternalLink,
  FileText,
  Gift,
  Globe2,
  HelpCircle,
  LogOut,
  Menu,
  Moon,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@proof-of-fit/ui";
import { LogoSymbol } from "@/components/branding/logo-symbol";
import { cn } from "@/lib/utils";

interface EnhancedHeaderProps {
  variant?: "landing" | "app" | "minimal";
  user?: {
    id: string;
    email: string;
    name?: string;
  } | null;
  onSignOut?: () => void;
}

export function EnhancedHeader({
  variant = "landing",
  user = null,
  onSignOut,
}: EnhancedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme ? "dark" : "light");
    }
  };

  const navigationItems = [
    { href: "#features", label: "Features", icon: FileText },
    { href: "#how-it-works", label: "How it Works", icon: Sparkles },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/gift", label: "Sponsor", icon: Gift },
    { href: "/fairness", label: "Fairness", icon: ShieldCheck },
  ];

  const userMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
    { code: "sw", name: "Kiswahili", flag: "🇹🇿" },
  ];

  const helpItems = [
    { href: "/docs", label: "Documentation", icon: BookOpen },
    { href: "/support", label: "Support", icon: ExternalLink },
    { href: "/changelog", label: "Changelog", icon: Sparkles },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] bg-black text-white px-3 py-2 rounded"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl",
          "border-b border-slate-200/50 dark:border-slate-800/50",
          scrolled
            ? "shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            : "shadow-sm",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 h-18 flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-all duration-200"
          >
            <LogoSymbol
              className="h-9 w-9 group-hover:scale-105 transition-transform duration-200"
              variant="default"
            />
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              ProofOfFit
            </span>
          </Link>

          {/* Desktop Navigation */}
          {variant === "landing" && (
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative px-4 py-2 rounded-lg inline-flex items-center gap-2",
                    "text-sm font-medium transition-all duration-200",
                    "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                    "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    isActive(item.href) &&
                      "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20",
                  )}
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  <Globe2 className="h-4 w-4" />
                  <span className="hidden sm:inline">EN</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg z-[100]"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="inline-flex items-center gap-2"
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Help</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg z-[100]"
              >
                {helpItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    className="inline-flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 block dark:hidden" />
            </Button>

            {/* Auth Section */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              {user
                ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                      >
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                          {user.name?.charAt(0) ||
                            user.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden sm:inline">
                          {user.name || user.email}
                        </span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg z-[100]"
                    >
                      <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                      {userMenuItems.map((item) => (
                        <DropdownMenuItem
                          key={item.href}
                          className="inline-flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onClick={onSignOut}
                        className="inline-flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
                : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                    >
                      <Link
                        href="/auth/signin"
                        aria-label="Sign in to your ProofOfFit account"
                        rel="noopener"
                      >
                        Sign in
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-6"
                    >
                      <Link
                        href="/auth/signup"
                        aria-label="Get started with ProofOfFit - Create your free account"
                        rel="noopener"
                      >
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 block dark:hidden" />
            </Button>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Main menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {/* Navigation Links */}
                  {variant === "landing" && (
                    <>
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="py-1 inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Language Selector */}
                  <div className="pt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full inline-flex items-center justify-between"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Globe2 className="h-4 w-4" />
                            Language
                          </span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Help Menu */}
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full inline-flex items-center justify-between"
                        >
                          <span className="inline-flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Help
                          </span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {helpItems.map((item) => (
                          <DropdownMenuItem
                            key={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="inline-flex items-center gap-2"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Auth Buttons */}
                  <div className="flex gap-2 pt-2">
                    {user
                      ? (
                        <div className="w-full space-y-2">
                          <div className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {user.name || "User"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              onSignOut?.();
                              setIsMenuOpen(false);
                            }}
                          >
                            Sign out
                          </Button>
                        </div>
                      )
                      : (
                        <>
                          <Button variant="outline" asChild className="w-1/2">
                            <Link
                              href="/auth/signin"
                              onClick={() => setIsMenuOpen(false)}
                              aria-label="Sign in to your account"
                              rel="noopener"
                            >
                              Sign in
                            </Link>
                          </Button>
                          <Button
                            asChild
                            className="w-1/2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
                          >
                            <Link
                              href="/auth/signup"
                              onClick={() => setIsMenuOpen(false)}
                              aria-label="Get started with ProofOfFit"
                              rel="noopener"
                            >
                              Get Started
                            </Link>
                          </Button>
                        </>
                      )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
