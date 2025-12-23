import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { TableCell, TableRow } from "@/components/ui/Table";
import { formatDistanceToNow } from "date-fns";

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: "P1" | "P2" | "P3" | "P4";
  status: "ai-investigating" | "human-intervention" | "resolved" | "auto-healed" | "active" | "investigating";
  mttr: string | null;
  createdAt: string;
}

interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const severityVariant =
    incident.severity === "P1"
      ? "severity-p1"
      : incident.severity === "P2"
      ? "severity-p2"
      : incident.severity === "P3"
      ? "severity-p3"
      : "default";

  const getStatusDisplay = () => {
    switch (incident.status) {
      case "ai-investigating":
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span className="text-sm text-white">AI Investigating</span>
          </div>
        );
      case "human-intervention":
        return (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-slate-400">
              group
            </span>
            <span className="text-sm text-white">Human Intervention</span>
          </div>
        );
      case "resolved":
        return (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-success">
              check_circle
            </span>
            <span className="text-sm text-success">Resolved</span>
          </div>
        );
      case "auto-healed":
        return (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-success">
              check_circle
            </span>
            <span className="text-sm text-success">Auto-healed</span>
          </div>
        );
      default:
        // Fallback for old status types
        const statusVariant =
          incident.status === "resolved"
            ? "success"
            : incident.status === "investigating"
            ? "severity-p2"
            : "severity-p1";
        return (
          <Badge variant={statusVariant as any}>
            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
          </Badge>
        );
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Badge variant={severityVariant as any}>{incident.severity}</Badge>
      </TableCell>
      <TableCell>
        <Link
          href={`/dashboard/incidents/${incident.id}`}
          className="font-medium text-white hover:text-primary transition-colors"
        >
          {incident.title}
        </Link>
      </TableCell>
      <TableCell className="text-slate-400">{incident.service}</TableCell>
      <TableCell>{getStatusDisplay()}</TableCell>
      <TableCell className="text-slate-400">
        {incident.mttr || "—"}
      </TableCell>
      <TableCell className="text-slate-400">
        {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
      </TableCell>
    </TableRow>
  );
}

