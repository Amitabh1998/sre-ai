"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Ultra-minimal background - just subtle grid like Linear/Retool */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Subtle geometric accent - very minimal */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-primary/10 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Minimal badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 mb-8 ${mounted ? 'animate-fade-in-up' : ''}`}>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI-Powered SRE</span>
          </div>

          {/* Large, bold headline - Framer style */}
          <h1 className={`text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-[-0.02em] mb-6 ${mounted ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '100ms' }}>
            AI for production
          </h1>

          {/* Clean subheading */}
          <p className={`text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 ${mounted ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '200ms' }}>
            Resolve incidents, optimize costs, and code with production context using AI that works across your code, infra, and telemetry.
          </p>

          {/* Clean CTA Buttons - Framer style */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 ${mounted ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '300ms' }}>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
              >
                Get started free
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto"
              >
                Sign in
              </Button>
            </Link>
          </div>

          {/* Minimal trust indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 ${mounted ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '400ms' }}>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              14-day trial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              5 min setup
            </span>
          </div>
        </div>

        {/* Process Flowchart - showing AI investigation workflow */}
        <div className={`mt-24 max-w-4xl mx-auto ${mounted ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '500ms' }}>
          <div className="relative space-y-0">
            {/* Connecting lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/30 via-slate-700/20 to-emerald-500/30 -translate-x-1/2"></div>
            
            {/* Step 1: Incident */}
            <div className="relative mb-6">
              <div className="bg-white/5 rounded-xl border-2 border-amber-500/50 p-6 backdrop-blur-sm shadow-lg shadow-amber-500/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <span className="material-symbols-outlined text-amber-400 text-xl">warning</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Incident</h3>
                    <p className="text-sm text-slate-400">Critical Alert: API Latency Response time &gt; 5s</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Plan */}
            <div className="relative mb-6">
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-slate-400 text-xl">description</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3">Plan</h3>
                    <div className="space-y-2">
                      {[
                        "Traces done",
                        "Logs reviewed",
                        "Dashboards updated",
                        "Code checked"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="material-symbols-outlined text-success text-base">check_circle</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Root Cause Analysis */}
            <div className="relative mb-6">
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-slate-400 text-xl">psychology</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3">Root Cause Analysis</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        <span>Database connection pool exhausted</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span>Recent deployment at 14:32 UTC</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        <span>Config change: max_connections=50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Recommended Action */}
            <div className="relative">
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <span className="material-symbols-outlined text-emerald-400 text-xl">star</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3">Recommended Action</h3>
                    <div className="space-y-2">
                      {[
                        "Increase max_connections to 200",
                        "Rollback deployment v2.1.3"
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

