import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { TableCell, TableRow } from "@/components/ui/Table";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Incident } from "@/lib/types";

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
      case "investigating":
        // Handle old "investigating" status format
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-severity-p2"></div>
            <span className="text-sm text-white">Investigating</span>
          </div>
        );
      case "active":
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-severity-p1"></div>
            <span className="text-sm text-white">Active</span>
          </div>
        );
      default:
        // TypeScript exhaustiveness check - this should never happen
        const _exhaustive: never = incident.status;
        return (
          <Badge variant="default">
            {String(incident.status).charAt(0).toUpperCase() + String(incident.status).slice(1).replace(/-/g, " ")}
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
        {formatRelativeTime(incident.createdAt)}
      </TableCell>
    </TableRow>
  );
}

