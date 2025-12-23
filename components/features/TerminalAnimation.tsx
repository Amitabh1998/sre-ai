"use client";

export function TerminalAnimation() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-background-dark p-8">
      <div className="w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <span className="ml-2 text-xs text-slate-400 font-mono">
            incidents-monitor - zsh
          </span>
        </div>
        <div className="p-4 font-mono text-sm">
          <div className="text-slate-300">
            <span className="text-primary">→</span>{" "}
            <span className="text-slate-400">~</span>{" "}
            <span className="text-white">
              tail -f /var/log/syslog | ai-agent analyze
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-slate-400">
              [10:42:01] INFO: Monitoring active services...
            </div>
            <div className="text-severity-p2">
              [10:42:05] WARN: Latency spike detected in payment-gateway-v2
            </div>
            <div className="mt-4 rounded border border-severity-p1 bg-severity-p1/10 p-3">
              <div className="font-semibold text-severity-p1">
                CRITICAL ALERT DETECTED
              </div>
              <div className="mt-1 text-white">Error 503: Service Unavailable</div>
            </div>
            <div className="mt-4 space-y-1 pl-4">
              <div className="text-primary">AI Agent Investigating...</div>
              <div className="pl-4 text-slate-300">
                <div>&gt; Parsing stack traces</div>
                <div>&gt; Correlating with recent deployments</div>
                <div className="text-success">
                  &gt; Root cause identified: Memory leak in worker-node-04
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded border border-success bg-success/10 p-3">
              <span className="material-symbols-outlined text-success">check_circle</span>
              <span className="text-success">
                Auto-remediation script generated. Waiting for approval.
              </span>
            </div>
            <div className="mt-4 text-slate-300">
              <span className="text-primary">→</span>{" "}
              <span className="text-slate-400">~</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Automate your Incident Response
        </h2>
        <p className="text-lg text-slate-400 mb-8">
          Let the AI agent investigate root causes in seconds while you focus on
          the fix. Reduce MTTR by 80%.
        </p>
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm text-slate-400">MONITORING</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">&lt; 30s</div>
            <div className="text-sm text-slate-400">RESPONSE TIME</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-sm text-slate-400">ACCURACY</div>
          </div>
        </div>
        <div className="mt-8 text-xs text-slate-500">v2.4.0-stable</div>
      </div>
    </div>
  );
}

