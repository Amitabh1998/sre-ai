"use client";

interface Integration {
  name: string;
  category: string;
  icon: string;
}

const integrations: Integration[] = [
  { name: "Datadog", category: "Monitoring", icon: "monitoring" },
  { name: "PagerDuty", category: "Alerting", icon: "notifications_active" },
  { name: "Slack", category: "Communication", icon: "chat" },
  { name: "Grafana", category: "Monitoring", icon: "dashboard" },
  { name: "New Relic", category: "Monitoring", icon: "analytics" },
  { name: "Splunk", category: "Logging", icon: "description" },
  { name: "CloudWatch", category: "Monitoring", icon: "cloud" },
  { name: "GitHub", category: "Version Control", icon: "code" },
  { name: "Jira", category: "Project Management", icon: "task" },
  { name: "Opsgenie", category: "Alerting", icon: "emergency" },
  { name: "ServiceNow", category: "ITSM", icon: "settings" },
  { name: "Zendesk", category: "Support", icon: "support_agent" },
];

export function Integrations() {
  return (
    <section className="py-24 bg-background-dark relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Integrations</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Works With Your Stack
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Connect with your favorite tools. No vendor lock-in, no migration headaches.
          </p>
        </div>

        {/* Integrations grid with enhanced cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-surface-dark/40 border border-slate-800/60 hover:border-primary/30 hover:bg-surface-dark/70 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer backdrop-blur-md hover:-translate-y-2"
              style={{ 
                animationDelay: `${index * 50}ms`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800/70 to-slate-900/50 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-primary/20">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors duration-500">
                    {integration.icon}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors">{integration.name}</h3>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors font-medium">{integration.category}</p>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* More integrations text */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-base">
            And 20+ more integrations.{" "}
            <a href="/signup" className="text-primary hover:text-blue-400 transition-colors font-semibold hover:underline underline-offset-4">
              See all integrations →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

