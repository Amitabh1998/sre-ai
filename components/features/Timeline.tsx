import { formatDate } from "@/lib/utils/format";

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

function getEventIcon(type: TimelineEvent["type"]): string {
  switch (type) {
    case "alert":
      return "notifications";
    case "investigation":
      return "search";
    case "action":
      return "settings";
    case "resolution":
      return "check_circle";
    default:
      return "circle";
  }
}

function getEventColor(type: TimelineEvent["type"]): string {
  switch (type) {
    case "alert":
      return "bg-severity-p1/20 border-severity-p1/40 text-severity-p1";
    case "investigation":
      return "bg-severity-p2/20 border-severity-p2/40 text-severity-p2";
    case "action":
      return "bg-primary/20 border-primary/40 text-primary";
    case "resolution":
      return "bg-success/20 border-success/40 text-success";
    default:
      return "bg-slate-700/20 border-slate-600/40 text-slate-400";
  }
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-700 via-slate-600 to-transparent" />
      <div className="space-y-6">
        {events.map((event, index) => {
          const eventColor = getEventColor(event.type);
          const eventIcon = getEventIcon(event.type);
          
          return (
            <div key={event.id} className="relative flex gap-4 group">
              <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-dark border-2 transition-all duration-200 group-hover:scale-110 ${eventColor}`}>
                <span className={`material-symbols-outlined text-sm ${eventColor.split(' ')[2]}`}>
                  {eventIcon}
                </span>
                {index === events.length - 1 && (
                  <div className={`absolute inset-0 rounded-full animate-ping ${eventColor.split(' ')[0]}`} style={{ animationDuration: '2s' }}></div>
                )}
              </div>
              <div className="flex-1 pb-6 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap font-mono">
                    {formatDate(event.timestamp, "HH:mm:ss")}
                  </span>
                </div>
                {event.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">{event.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

