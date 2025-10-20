"use client";

import Link from "next/link";
import { Button } from "@proof-of-fit/ui";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LogoSymbol } from "@/components/branding/logo-symbol";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <LogoSymbol className="h-8 w-8" />
            <span className="font-bold text-xl text-gray-900">ProofOfFit</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link
              href="/auth/signin"
              aria-label="Sign in to your ProofOfFit account"
              rel="noopener"
            >
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link
              href="/auth/signup"
              aria-label="Get started with ProofOfFit - Create your free account"
              rel="noopener"
            >
              Get Started
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen
            ? <X className="h-5 w-5" />
            : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white">
          <div className="container py-4 space-y-4">
            <Link
              href="#features"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link
                  href="/auth/signin"
                  aria-label="Sign in to your account"
                  rel="noopener"
                >
                  Sign In
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link
                  href="/auth/signup"
                  aria-label="Get started - Create your free account"
                  rel="noopener"
                >
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
