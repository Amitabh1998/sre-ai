import { format } from "date-fns";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "alert" | "investigation" | "action" | "resolution";
  title: string;
  description?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex gap-4">
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-dark border-2 border-slate-700">
              <div
                className={`h-3 w-3 rounded-full ${
                  event.type === "alert"
                    ? "bg-severity-p1"
                    : event.type === "investigation"
                    ? "bg-severity-p2"
                    : event.type === "action"
                    ? "bg-primary"
                    : "bg-success"
                }`}
              />
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-white">{event.title}</h4>
                <span className="text-xs text-slate-500">
                  {format(new Date(event.timestamp), "HH:mm:ss")}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-slate-400">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

