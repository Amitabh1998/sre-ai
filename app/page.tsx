"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Integrations } from "@/components/landing/Integrations";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If authenticated, redirect to dashboard (but allow viewing landing page first)
  // Comment out this useEffect to always show landing page
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push("/dashboard");
  //   }
  // }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background-dark">
      <Navbar />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="integrations">
          <Integrations />
        </div>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
