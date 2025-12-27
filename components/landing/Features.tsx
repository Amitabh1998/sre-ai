"use client";

interface Feature {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    icon: "psychology",
    title: "AI-Powered Root Cause Analysis",
    description: "Automatically analyze logs, metrics, and recent changes to identify the root cause of incidents in seconds, not hours.",
    highlight: true,
  },
  {
    icon: "speed",
    title: "Real-Time Incident Response",
    description: "Get instant alerts and automated investigation workflows that reduce MTTR by up to 80%.",
  },
  {
    icon: "integration_instructions",
    title: "Seamless Integrations",
    description: "Connect with Datadog, PagerDuty, Slack, and 20+ other tools. Works with your existing stack.",
  },
  {
    icon: "insights",
    title: "Intelligent Hypotheses",
    description: "AI generates multiple hypotheses with confidence scores, evidence, and suggested fixes for faster resolution.",
  },
  {
    icon: "timeline",
    title: "Complete Incident Timeline",
    description: "Track every event, action, and investigation step in one unified timeline for better visibility.",
  },
  {
    icon: "groups",
    title: "Team Collaboration",
    description: "Share insights, assign incidents, and collaborate with your team in real-time.",
  },
  {
    icon: "auto_awesome",
    title: "Automated Remediation",
    description: "AI suggests fixes and can trigger automated remediation workflows for common issues.",
  },
  {
    icon: "analytics",
    title: "Post-Mortem Insights",
    description: "Automatically generate post-mortem reports and learn from every incident to prevent future issues.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background-dark relative overflow-hidden">
      {/* Enhanced background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with enhanced styling */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 via-cyan-400 to-primary bg-clip-text text-transparent">
              Master Incident Response
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Built for modern SRE teams who need intelligent automation without the complexity.
          </p>
        </div>

        {/* Features grid with enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl border transition-all duration-700 ${
                feature.highlight
                  ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
                  : "bg-surface-dark/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-surface-dark/60 hover:shadow-2xl hover:shadow-slate-900/30"
              } backdrop-blur-md hover:-translate-y-2`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Icon with enhanced styling */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-500 ${
                  feature.highlight
                    ? "bg-gradient-to-br from-primary/30 to-primary/10 text-primary shadow-lg shadow-primary/20"
                    : "bg-slate-800/70 text-slate-400 group-hover:text-primary group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary/10"
                } group-hover:scale-110 group-hover:rotate-3`}
              >
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-3 leading-tight group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.description}</p>

              {/* Enhanced decorative elements */}
              {feature.highlight && (
                <>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                </>
              )}
              
              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-3xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

