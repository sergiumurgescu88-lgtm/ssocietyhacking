import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

const SkeletonCard = ({ className, lines = 3 }: SkeletonCardProps) => (
  <div className={cn("glass-card p-5 space-y-4 animate-pulse", className)}>
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-muted/50" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 rounded bg-muted/50" />
        <div className="h-3 w-1/2 rounded bg-muted/40" />
      </div>
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-3 rounded bg-muted/30" style={{ width: `${85 - i * 15}%` }} />
    ))}
  </div>
);

const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="glass-card animate-pulse">
    <div className="p-5 border-b border-border/50">
      <div className="h-5 w-32 rounded bg-muted/50" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-3 w-1/4 rounded bg-muted/30" />
          <div className="h-3 w-1/5 rounded bg-muted/20" />
          <div className="h-3 w-1/6 rounded bg-muted/20" />
          <div className="h-3 w-1/6 rounded bg-muted/15" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonStats = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="glass-card p-5 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-9 w-9 rounded-lg bg-muted/40" />
          <div className="h-3 w-12 rounded bg-muted/30" />
        </div>
        <div className="h-7 w-16 rounded bg-muted/50 mb-1" />
        <div className="h-3 w-24 rounded bg-muted/30" />
      </div>
    ))}
  </div>
);

export { SkeletonCard, SkeletonTable, SkeletonStats };
