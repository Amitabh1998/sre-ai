"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const steps = [
  {
    id: 1,
    title: "Connect Slack",
    next: "Connect Source",
  },
  {
    id: 2,
    title: "Connect Source",
    next: "Connect Observability",
  },
  {
    id: 3,
    title: "Connect Observability",
    next: "Install Agent",
  },
  {
    id: 4,
    title: "Install Agent",
  },
];

const observabilityTools = [
  { id: "datadog", name: "Datadog", icon: "monitoring", description: "Cloud monitoring and analytics" },
  { id: "grafana", name: "Grafana", icon: "analytics", description: "Observability and metrics" },
  { id: "cloudwatch", name: "CloudWatch", icon: "cloud", description: "AWS monitoring service" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<"pagerduty" | "opsgenie" | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [selectedObservability, setSelectedObservability] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and go to dashboard
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSlackConnect = () => {
    // Mock Slack connection
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const toggleObservability = (id: string) => {
    setSelectedObservability((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-background-dark">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 bg-surface-dark px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-white">SRE Agent</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-slate-400 hover:text-white">
            Need help? Read Docs
          </Link>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xs font-semibold">JD</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          {/* Progress Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex-1 max-w-md">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {steps[currentStep - 1].next && (
                <span className="text-sm text-slate-400">
                  Next: {steps[currentStep - 1].next}
                </span>
              )}
            </div>
          </div>

          {/* Step 1: Connect Slack */}
          {currentStep === 1 && (
            <Card className="border-primary/20 bg-surface-dark/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 rounded-xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-700 w-24 border-dashed border-t-2"></div>
                    <div className="h-16 w-16 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative">
                      <span className="text-2xl text-white">#</span>
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-severity-p1 rounded-full border-2 border-surface-dark"></div>
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white text-center mb-4">
                  Let&apos;s connect to your war room.
                </h2>
                <p className="text-slate-400 text-center mb-8 max-w-lg mx-auto">
                  Invite <strong className="text-white">SRE Agent</strong> to your Slack workspace to start auto-investigating incidents in real-time.
                </p>

                <div className="space-y-3 mb-8 max-w-md mx-auto">
                  {[
                    "Get incident summaries in threads",
                    "Query infrastructure from chat",
                    "Zero-config setup, instant read-only",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-slate-300">
                      <span className="text-primary">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <Button variant="primary" size="lg" onClick={handleSlackConnect}>
                    <span className="material-symbols-outlined mr-2">link</span>
                    Connect Slack Workspace
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>
                    We require read access to public channels to detect alerts. We <strong>do not store</strong> message history.{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Learn more about our security
                    </Link>
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Connect Source */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Connect your Alerting Provider
                </h2>
                <p className="text-slate-400">
                  The AI Agent monitors these sources to instantly investigate new incidents. We need read access to analyze incident history.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card
                  variant="integration"
                  className={`cursor-pointer transition-all ${
                    selectedProvider === "pagerduty"
                      ? "border-primary bg-primary/10"
                      : ""
                  }`}
                  onClick={() => setSelectedProvider("pagerduty")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
                        <span className="text-success font-bold text-xl">P</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">PagerDuty</h3>
                        <p className="text-sm text-slate-400">Most popular for startups</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 ${
                      selectedProvider === "pagerduty"
                        ? "border-primary bg-primary"
                        : "border-slate-600"
                    }`}>
                      {selectedProvider === "pagerduty" && (
                        <div className="h-full w-full rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </Card>

                <Card
                  variant="integration"
                  className={`cursor-pointer transition-all ${
                    selectedProvider === "opsgenie"
                      ? "border-primary bg-primary/10"
                      : ""
                  }`}
                  onClick={() => setSelectedProvider("opsgenie")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Opsgenie</h3>
                        <p className="text-sm text-slate-400">Atlassian Cloud & Server</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 ${
                      selectedProvider === "opsgenie"
                        ? "border-primary bg-primary"
                        : "border-slate-600"
                    }`}>
                      {selectedProvider === "opsgenie" && (
                        <div className="h-full w-full rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {selectedProvider && (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-300">
                        Integration Key / API Token
                      </label>
                      <Link href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">help</span>
                        Where do I find this?
                      </Link>
                    </div>
                    <Input
                      type="password"
                      placeholder="Paste your read-only API key here"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      icon={<span className="material-symbols-outlined">key</span>}
                    />
                    <div className="flex items-center gap-2 text-sm text-success">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>Your key is encrypted and stored securely.</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Connect Observability */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Connect your Observability Tools
                </h2>
                <p className="text-slate-400">
                  Link your monitoring tools to enable AI-powered root cause analysis. Select all that apply.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {observabilityTools.map((tool) => (
                  <Card
                    key={tool.id}
                    variant="integration"
                    className={`cursor-pointer transition-all ${
                      selectedObservability.includes(tool.id)
                        ? "border-primary bg-primary/10"
                        : ""
                    }`}
                    onClick={() => toggleObservability(tool.id)}
                  >
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-slate-400">
                          {tool.icon}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white mb-1">{tool.name}</h3>
                      <p className="text-xs text-slate-400 mb-3">{tool.description}</p>
                      {selectedObservability.includes(tool.id) && (
                        <Badge variant="success" className="mt-2">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {selectedObservability.length > 0 && (
                <Card className="border-success/20 bg-success/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-success">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span className="text-sm font-medium">
                        {selectedObservability.length} tool{selectedObservability.length > 1 ? "s" : ""} selected
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Install Agent */}
          {currentStep === 4 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="h-20 w-20 rounded-xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-primary">
                      download
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Install the Agent
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Download and install the SRE Agent in your infrastructure to start monitoring.
                  </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    <span className="material-symbols-outlined mr-2">download</span>
                    Download Agent
                  </Button>
                  <p className="text-sm text-slate-400">
                    Or follow the installation guide for your platform
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div>
              {currentStep === 1 ? (
                <Link href="/dashboard" className="text-slate-400 hover:text-white">
                  Skip for now
                </Link>
              ) : (
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={
                (currentStep === 2 && (!selectedProvider || !apiKey)) ||
                (currentStep === 3 && selectedObservability.length === 0) ||
                false
              }
            >
              {currentStep === steps.length ? "Complete Setup" : "Continue"}
              {currentStep < steps.length && (
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
