"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/utils/format";

export interface AIActivity {
  id: string;
  title: string;
  timestamp: string;
  type: "investigating" | "resolved" | "healed" | "health-check";
  description: string;
  details?: string[];
  isLive?: boolean;
}

interface AIActivityFeedProps {
  activities: AIActivity[];
}

export function AIActivityFeed({ activities }: AIActivityFeedProps) {
  const getStatusColor = (type: string, isLive?: boolean) => {
    if (isLive) return "bg-primary";
    if (type === "resolved" || type === "healed") return "bg-success";
    return "bg-slate-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Activity Feed</CardTitle>
        <Badge variant="severity-p1" className="animate-pulse">
          LIVE
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative flex gap-4">
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full ${getStatusColor(
                    activity.type,
                    activity.isLive
                  )} ${activity.isLive ? "animate-pulse" : ""}`}
                />
                {activity.isLive && (
                  <div className="absolute top-0 left-0 h-3 w-3 rounded-full bg-primary/50 animate-ping" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-white">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {activity.isLive ? "Now" : formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  {activity.description}
                </p>
                {activity.details && activity.details.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {activity.details.map((detail, index) => (
                      <p
                        key={index}
                        className="text-xs text-slate-500 font-mono"
                      >
                        &gt; {detail}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

