"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Incident Detected",
    description: "Receive alerts from your monitoring tools or create incidents manually. Our AI agent is instantly notified.",
    icon: "notifications",
  },
  {
    number: "02",
    title: "AI Investigation",
    description: "The AI agent automatically gathers logs, metrics, and recent deployment data to understand the context.",
    icon: "search",
  },
  {
    number: "03",
    title: "Root Cause Analysis",
    description: "AI analyzes the data and generates multiple hypotheses with confidence scores, evidence, and suggested fixes.",
    icon: "psychology",
  },
  {
    number: "04",
    title: "Resolution & Learning",
    description: "Your team reviews the hypotheses, implements fixes, and the system learns from every incident.",
    icon: "check_circle",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-surface-dark/40 via-background-dark to-background-dark relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(60, 131, 246, 0.15) 1px, transparent 1px),
                              linear-gradient(rgba(60, 131, 246, 0.15) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            How It Works
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            From incident detection to resolution in minutes, not hours.
          </p>
        </div>

        {/* Steps with enhanced design */}
        <div className="relative">
          {/* Enhanced connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/30 via-blue-500/30 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
            {steps.map((step, index) => (
              <div key={index} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                {/* Step number badge with glow */}
                <div className="flex items-start gap-4 mb-10">
                  <div className="relative flex-shrink-0 w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-blue-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {step.number}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-blue-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-20 right-0 h-1 bg-gradient-to-r from-primary/40 via-blue-500/40 to-transparent"></div>
                  )}
                </div>

                {/* Icon with enhanced styling */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 mb-8 group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:to-primary/10 group-hover:border-primary/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-primary/10">
                  <span className="material-symbols-outlined text-primary text-4xl">{step.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-3 leading-tight group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-12">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

