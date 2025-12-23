import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface Integration {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  logo?: string;
}

interface IntegrationCardProps {
  integration: Integration;
  onConnect?: () => void;
}

export function IntegrationCard({ integration, onConnect }: IntegrationCardProps) {
  return (
    <Card variant="integration" onClick={onConnect}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400">
              {integration.category === "alerting"
                ? "notifications"
                : integration.category === "observability"
                ? "monitoring"
                : integration.category === "communication"
                ? "chat"
                : "code"}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-white">{integration.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{integration.category}</p>
          </div>
        </div>
        {integration.connected ? (
          <Badge variant="success">Connected</Badge>
        ) : (
          <Button size="sm" variant="primary">
            Connect
          </Button>
        )}
      </div>
    </Card>
  );
}

