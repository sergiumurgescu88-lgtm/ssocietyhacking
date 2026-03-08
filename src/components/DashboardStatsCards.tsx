import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Radar, AlertTriangle, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

type AuthStatus = "Active" | "Pending" | "None";

const authStatusConfig: Record<AuthStatus, { color: string; badgeClass: string; progress: number }> = {
  Active: { color: "text-green-400", badgeClass: "bg-green-500/15 text-green-400 border-green-500/20", progress: 100 },
  Pending: { color: "text-yellow-400", badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20", progress: 50 },
  None: { color: "text-destructive", badgeClass: "bg-destructive/15 text-destructive border-destructive/20", progress: 0 },
};

export const DashboardStatsCards = () => {
  // Mock data — replace with real data later
  const authStatus: AuthStatus = "Active";
  const activeScans = 3;
  const vulnerabilities = 47;
  const reports = 89;

  const scanCounter = useAnimatedCounter(activeScans, 800);
  const vulnCounter = useAnimatedCounter(vulnerabilities);
  const reportCounter = useAnimatedCounter(reports);

  const auth = authStatusConfig[authStatus];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Card 1 — Authorization */}
      <div
        className="glass-card p-5 hover:scale-[1.02] hover:shadow-[0_0_24px_hsl(142_70%_45%/0.2)] transition-all duration-300 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-green-500/25 to-green-600/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-green-400" />
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${auth.badgeClass}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {authStatus}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Authorization</p>
        <p className={`text-2xl font-bold ${auth.color}`}>{authStatus}</p>
        <div className="mt-3">
          <Progress value={auth.progress} className="h-1.5 bg-muted/50 [&>div]:bg-green-500" />
        </div>
      </div>

      {/* Card 2 — Active Scans */}
      <div
        ref={scanCounter.ref}
        className="glass-card p-5 hover:scale-[1.02] hover:shadow-[0_0_24px_hsl(166_100%_42%/0.2)] transition-all duration-300 animate-fade-in"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 flex items-center justify-center">
            <Radar className="h-5 w-5 text-primary" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Live
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Active Scans</p>
        <p className="text-2xl font-bold text-foreground font-mono">{scanCounter.value}</p>
        <p className="text-xs text-muted-foreground mt-2">Currently running</p>
      </div>

      {/* Card 3 — Vulnerabilities */}
      <div
        ref={vulnCounter.ref}
        className="glass-card p-5 hover:scale-[1.02] hover:shadow-[0_0_24px_hsl(255_100%_69%/0.2)] transition-all duration-300 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-secondary/25 to-secondary/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-secondary" />
          </div>
          <span className="text-[11px] font-semibold text-secondary">-8% vs last week</span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Found</p>
        <p className="text-2xl font-bold text-foreground font-mono">{vulnCounter.value}</p>
        <div className="flex gap-2 mt-3">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-destructive/20 text-destructive">5 Critical</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/20 text-orange-400">12 High</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/20 text-yellow-400">30 Med</span>
        </div>
      </div>

      {/* Card 4 — Reports */}
      <div
        ref={reportCounter.ref}
        className="glass-card p-5 hover:scale-[1.02] hover:shadow-[0_0_24px_hsl(210_100%_60%/0.2)] transition-all duration-300 animate-fade-in"
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500/25 to-blue-600/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-[11px] font-semibold text-blue-400">+5 this month</span>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Generated</p>
        <p className="text-2xl font-bold text-foreground font-mono">{reportCounter.value}</p>
        <p className="text-xs text-muted-foreground mt-2">This month: 12 reports</p>
      </div>
    </div>
  );
};
