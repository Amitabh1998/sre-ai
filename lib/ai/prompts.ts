/**
 * Prompt templates for AI investigation
 */

export function getInvestigationPrompt(
  incidentData: {
    title: string;
    service: string;
    severity: string;
    description?: string;
    logs?: string[];
    metrics?: Record<string, unknown>;
    recentDeployments?: string[];
  }
): string {
  return `You are an AI SRE agent investigating an incident. Analyze the following data and generate hypotheses about the root cause.

Incident Details:
- Title: ${incidentData.title}
- Service: ${incidentData.service}
- Severity: ${incidentData.severity}
${incidentData.description ? `- Description: ${incidentData.description}` : ""}

${incidentData.logs && incidentData.logs.length > 0
  ? `\nRelevant Logs:\n${incidentData.logs.slice(0, 50).join("\n")}`
  : ""}

${incidentData.metrics
  ? `\nMetrics:\n${JSON.stringify(incidentData.metrics, null, 2)}`
  : ""}

${incidentData.recentDeployments && incidentData.recentDeployments.length > 0
  ? `\nRecent Deployments:\n${incidentData.recentDeployments.join("\n")}`
  : ""}

Generate 2-4 hypotheses about the root cause. For each hypothesis, provide:
1. A clear title describing the root cause
2. A confidence score (0-100)
3. Evidence supporting the hypothesis (3-5 bullet points)
4. A suggested fix

Format your response as JSON:
{
  "hypotheses": [
    {
      "title": "Root cause description",
      "confidence": 85,
      "evidence": [
        "Evidence point 1",
        "Evidence point 2"
      ],
      "suggestedFix": "Detailed fix recommendation"
    }
  ]
}`;
}

export function getRemediationDecisionPrompt(
  hypothesis: {
    title: string;
    confidence: number;
    evidence: string[];
    suggestedFix: string;
  }
): string {
  return `You are an AI SRE agent deciding whether to auto-remediate an incident.

Hypothesis:
- Title: ${hypothesis.title}
- Confidence: ${hypothesis.confidence}%
- Evidence: ${hypothesis.evidence.join(", ")}
- Suggested Fix: ${hypothesis.suggestedFix}

Determine if this fix can be safely automated. Consider:
1. Risk level of the remediation action
2. Confidence in the root cause
3. Potential impact if the fix fails
4. Whether human review is required

Respond with JSON:
{
  "canAutoRemediate": true/false,
  "reason": "Explanation of decision",
  "riskLevel": "low" | "medium" | "high",
  "recommendedAction": "auto-remediate" | "escalate-to-human" | "wait-for-confirmation"
}`;
}

