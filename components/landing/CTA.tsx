"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-background-dark via-slate-950 to-background-dark relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-primary/25 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/25 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Refined grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block mb-6">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Get Started</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
          Ready to Transform Your
          <br />
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-primary via-blue-400 via-cyan-400 to-primary bg-clip-text text-transparent">
              Incident Response?
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-blue-400 via-cyan-400 to-primary bg-clip-text text-transparent blur-xl opacity-50">
              Incident Response?
            </span>
          </span>
        </h2>
        
        <p className="text-base md:text-lg text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Join teams using ReliOps AI to reduce MTTR by 80% and prevent incidents before they happen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link href="/signup">
            <Button 
              size="lg" 
              className="gap-2"
            >
              Start Free Trial
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="secondary" 
              size="lg"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          {[
            "No credit card required",
            "14-day free trial",
            "Setup in 5 minutes"
          ].map((text, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-success text-base">check_circle</span>
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

