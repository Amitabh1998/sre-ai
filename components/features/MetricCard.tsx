"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  badge?: string;
  status?: string;
  icon: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend,
  badge,
  status,
  icon,
}: MetricCardProps) {
  return (
    <Card variant="metric" className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <span className="material-symbols-outlined text-slate-500 text-lg">
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold text-white">{value}</span>
          <div className="flex items-center gap-2">
            {change && trend && (
              <div className="flex items-center gap-1">
                {trend === "up" ? (
                  <span className="text-success text-xs">↑</span>
                ) : (
                  <span className="text-success text-xs">↓</span>
                )}
                <span className="text-xs font-medium text-success">
                  {change}
                </span>
              </div>
            )}
            {badge && (
              <Badge variant="default" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        </div>
        {status && (
          <p className="text-xs text-slate-400 mt-1">{status}</p>
        )}
      </CardContent>
    </Card>
  );
}

