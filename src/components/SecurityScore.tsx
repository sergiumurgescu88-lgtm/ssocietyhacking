import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface SecurityScoreProps {
  score: number | null;
  loading?: boolean;
  sslScore?: number;
  headersScore?: number;
  findings?: { severity: string }[];
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-destructive";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Critical";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "from-green-500/20 to-green-500/5";
  if (score >= 60) return "from-yellow-500/20 to-yellow-500/5";
  if (score >= 40) return "from-orange-500/20 to-orange-500/5";
  return "from-destructive/20 to-destructive/5";
};

export const SecurityScoreCard = ({ score, loading, sslScore, headersScore, findings }: SecurityScoreProps) => {
  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (score === null) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardContent className="p-6 text-center">
          <Shield className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Run a scan to see your security score</p>
        </CardContent>
      </Card>
    );
  }

  const criticalCount = findings?.filter((f) => f.severity === "critical").length || 0;
  const highCount = findings?.filter((f) => f.severity === "high").length || 0;

  return (
    <Card className={cn("border-border/50 backdrop-blur overflow-hidden bg-gradient-to-br", getScoreBg(score))}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Security Score</p>
            <div className="flex items-end gap-2 mt-1">
              <span className={cn("text-4xl font-bold font-mono", getScoreColor(score))}>{score}</span>
              <span className="text-sm text-muted-foreground mb-1">/100</span>
            </div>
            <p className={cn("text-sm font-medium mt-1", getScoreColor(score))}>{getScoreLabel(score)}</p>
          </div>
          <div className={cn("h-16 w-16 rounded-full border-4 flex items-center justify-center", 
            score >= 60 ? "border-green-500/30" : "border-destructive/30"
          )}>
            {score >= 60 ? (
              <CheckCircle2 className="h-7 w-7 text-green-400" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-destructive" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          {sslScore !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">SSL/TLS</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${sslScore}%` }} />
                </div>
                <span className="text-xs font-mono text-foreground w-8 text-right">{sslScore}%</span>
              </div>
            </div>
          )}
          {headersScore !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Headers</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: `${headersScore}%` }} />
                </div>
                <span className="text-xs font-mono text-foreground w-8 text-right">{headersScore}%</span>
              </div>
            </div>
          )}
        </div>

        {(criticalCount > 0 || highCount > 0) && (
          <div className="mt-3 pt-3 border-t border-border/30 flex gap-3">
            {criticalCount > 0 && (
              <span className="text-xs text-destructive font-medium">{criticalCount} critical</span>
            )}
            {highCount > 0 && (
              <span className="text-xs text-orange-400 font-medium">{highCount} high</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const RiskHeatMap = ({ findings }: { findings: { severity: string; category: string }[] }) => {
  const categories = [...new Set(findings.map((f) => f.category))];
  const severities = ["critical", "high", "medium", "low", "info"];
  const sevColors: Record<string, string> = {
    critical: "bg-destructive/60",
    high: "bg-orange-500/50",
    medium: "bg-yellow-500/40",
    low: "bg-green-500/30",
    info: "bg-blue-500/20",
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${severities.length}, 1fr)` }}>
          <div />
          {severities.map((s) => (
            <div key={s} className="text-[9px] text-muted-foreground text-center font-medium uppercase">{s.slice(0, 4)}</div>
          ))}
          {categories.map((cat) => (
            <>
              <div key={`label-${cat}`} className="text-[10px] text-muted-foreground truncate pr-2 flex items-center">{cat.replace("_", " ")}</div>
              {severities.map((sev) => {
                const count = findings.filter((f) => f.category === cat && f.severity === sev).length;
                return (
                  <div
                    key={`${cat}-${sev}`}
                    className={cn("h-6 rounded-sm flex items-center justify-center text-[10px] font-mono",
                      count > 0 ? sevColors[sev] : "bg-muted/20"
                    )}
                  >
                    {count > 0 ? count : ""}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
