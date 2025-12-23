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

export function HypothesisCard({ hypothesis }: HypothesisCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{hypothesis.title}</CardTitle>
          <Badge variant="default">{hypothesis.confidence}% confidence</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Evidence:</h4>
          <ul className="space-y-1">
            {hypothesis.evidence.map((item, index) => (
              <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Suggested Fix:</h4>
          <p className="text-sm text-slate-400">{hypothesis.suggestedFix}</p>
        </div>
      </CardContent>
    </Card>
  );
}

