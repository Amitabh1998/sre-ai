"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IntegrationCard, type Integration } from "@/components/features/IntegrationCard";

const integrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    connected: true,
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    category: "alerting",
    connected: true,
  },
  {
    id: "opsgenie",
    name: "Opsgenie",
    category: "alerting",
    connected: false,
  },
  {
    id: "datadog",
    name: "Datadog",
    category: "observability",
    connected: false,
  },
  {
    id: "grafana",
    name: "Grafana",
    category: "observability",
    connected: false,
  },
  {
    id: "cloudwatch",
    name: "CloudWatch",
    category: "observability",
    connected: false,
  },
  {
    id: "github",
    name: "GitHub",
    category: "source-control",
    connected: false,
  },
  {
    id: "gitlab",
    name: "GitLab",
    category: "source-control",
    connected: false,
  },
];

const categories = [
  { id: "all", name: "All Integrations" },
  { id: "alerting", name: "Alerting" },
  { id: "observability", name: "Observability" },
  { id: "source-control", name: "Source Control" },
  { id: "communication", name: "Communication" },
];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const handleDisconnect = (integration: Integration) => {
    // TODO: Implement disconnect
    if (process.env.NODE_ENV === "development") {
      console.log("Disconnect:", integration.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-slate-400 mt-1">
          Connect your tools to automate incident response
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-primary text-white"
                : "bg-surface-dark text-slate-400 hover:text-white border border-slate-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={() => handleConnect(integration)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Connect ${selectedIntegration?.name}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            {selectedIntegration?.category === "alerting" ||
            selectedIntegration?.category === "observability"
              ? "Enter your API key to connect this integration."
              : "Click the button below to authorize this integration."}
          </p>
          {selectedIntegration?.category === "alerting" ||
          selectedIntegration?.category === "observability" ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                API Key
              </label>
              <Input
                type="password"
                placeholder="Enter your API key"
                icon={<span className="material-symbols-outlined">key</span>}
              />
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-sm text-slate-300">
                You will be redirected to {selectedIntegration?.name} to authorize
                access.
              </p>
            </div>
          )}
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Connect
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

