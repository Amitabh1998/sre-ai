"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-background-dark/90 backdrop-blur-2xl border-b border-slate-800/60 shadow-2xl shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo with enhanced styling */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-blue-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <span className="material-symbols-outlined text-white text-xl">shield</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-blue-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-primary transition-colors">ReliOps AI</span>
          </Link>

          {/* Desktop Navigation with enhanced styling */}
          <div className="hidden md:flex items-center gap-12">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#integrations", label: "Integrations" }
            ].map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className="text-sm text-slate-400 hover:text-white transition-all duration-300 font-semibold relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                Dashboard
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

