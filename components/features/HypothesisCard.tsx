import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export interface Hypothesis {
  id: string;
  title: string;
  confidence: number;
  evidence: string[];
  suggestedFix: string;
}

interface HypothesisCardProps {
  hypothesis: Hypothesis;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-emerald-400";
  if (confidence >= 60) return "text-amber-400";
  return "text-orange-400";
}

function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (confidence >= 60) return "bg-amber-500/20 border-amber-500/30";
  return "bg-orange-500/20 border-orange-500/30";
}

export function HypothesisCard({ hypothesis }: HypothesisCardProps) {
  const confidenceColor = getConfidenceColor(hypothesis.confidence);
  const confidenceBg = getConfidenceBgColor(hypothesis.confidence);

  return (
    <Card className="group hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
              {hypothesis.title}
            </CardTitle>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-20 rounded-full bg-slate-700 overflow-hidden ${confidenceBg}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      hypothesis.confidence >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : hypothesis.confidence >= 60
                        ? "bg-gradient-to-r from-amber-500 to-amber-400"
                        : "bg-gradient-to-r from-orange-500 to-orange-400"
                    }`}
                    style={{ width: `${hypothesis.confidence}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${confidenceColor}`}>
                  {hypothesis.confidence}%
                </span>
              </div>
              <Badge
                variant="default"
                className={`${confidenceBg} ${confidenceColor} border font-medium`}
              >
                {hypothesis.confidence >= 80
                  ? "High Confidence"
                  : hypothesis.confidence >= 60
                  ? "Medium Confidence"
                  : "Low Confidence"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {hypothesis.evidence.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">fact_check</span>
              <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                Evidence
              </h4>
            </div>
            <ul className="space-y-2.5 pl-6">
              {hypothesis.evidence.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-300 flex items-start gap-3 relative before:absolute before:left-[-1.25rem] before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/60"
                >
                  <span className="flex-1 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hypothesis.suggestedFix && (
          <div className="pt-4 border-t border-slate-700/50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-emerald-400">
                build
              </span>
              <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                Suggested Fix
              </h4>
            </div>
            <div className="pl-6">
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 rounded-md p-3 border border-slate-700/50">
                {hypothesis.suggestedFix}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

