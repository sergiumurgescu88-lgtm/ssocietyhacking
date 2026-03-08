import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Play,
  Square,
  Download,
  Plus,
  Loader2,
  Terminal,
  Table as TableIcon,
  Lock,
  Unlock,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const commonPaths = [
  { path: "/api/", label: "/api/" },
  { path: "/v1/", label: "/v1/" },
  { path: "/v2/", label: "/v2/" },
  { path: "/graphql", label: "/graphql" },
  { path: "/rest/", label: "/rest/" },
  { path: "/swagger", label: "/swagger" },
];

const riskConfig: Record<string, { color: string; badge: string }> = {
  low: { color: "text-green-400", badge: "bg-green-500/15 text-green-400 border-green-500/20" },
  medium: { color: "text-yellow-400", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  high: { color: "text-destructive", badge: "bg-destructive/15 text-destructive border-destructive/20" },
  critical: { color: "text-destructive", badge: "bg-destructive/15 text-destructive border-destructive/20" },
};

// Mock scan simulation for demo
const mockEndpoints = [
  { endpoint: "/api/v1/users", method: "GET", auth_required: false, risk_level: "high", response_code: 200 },
  { endpoint: "/api/v1/users/:id", method: "GET", auth_required: true, risk_level: "low", response_code: 200 },
  { endpoint: "/api/v1/auth/login", method: "POST", auth_required: false, risk_level: "medium", response_code: 200 },
  { endpoint: "/api/v1/admin/config", method: "GET", auth_required: false, risk_level: "critical", response_code: 403 },
  { endpoint: "/api/v1/files/upload", method: "POST", auth_required: true, risk_level: "medium", response_code: 200 },
  { endpoint: "/api/v2/graphql", method: "POST", auth_required: true, risk_level: "low", response_code: 200 },
  { endpoint: "/api/v1/health", method: "GET", auth_required: false, risk_level: "low", response_code: 200 },
  { endpoint: "/swagger/ui", method: "GET", auth_required: false, risk_level: "medium", response_code: 200 },
];

const ApiDiscovery = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const terminalRef = useRef<HTMLDivElement>(null);

  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [depth, setDepth] = useState([2]);
  const [rateLimit, setRateLimit] = useState(true);
  const [respectRobots, setRespectRobots] = useState(true);
  const [selectedPaths, setSelectedPaths] = useState<string[]>(["/api/", "/v1/"]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "terminal">("table");
  const [scanResults, setScanResults] = useState<typeof mockEndpoints>([]);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  // Fetch approved authorizations
  const { data: approvedAuths = [] } = useQuery({
    queryKey: ["approved-authorizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authorizations")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const selectedAuth = approvedAuths.find((a: any) => a.target_domain === selectedDomain);

  const addTerminalLine = (line: string) => {
    setTerminalLines((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const startScan = async () => {
    if (!user || !selectedDomain) return;

    setScanning(true);
    setProgress(0);
    setScanResults([]);
    setTerminalLines([]);

    addTerminalLine(`$ ssocietysafe scan --target ${selectedDomain}`);
    addTerminalLine(`[INFO] Starting API Discovery scan...`);
    addTerminalLine(`[INFO] Depth: ${depth[0]} | Rate limit: ${rateLimit ? "1 req/s" : "unlimited"} | Robots.txt: ${respectRobots ? "yes" : "no"}`);
    addTerminalLine(`[INFO] Scanning paths: ${selectedPaths.join(", ")}`);

    // Create scan record
    const { data: scanData, error: scanError } = await supabase
      .from("scans")
      .insert({
        user_id: user.id,
        authorization_id: selectedAuth?.id ?? null,
        target_domain: selectedDomain,
        scan_type: "api_discovery",
        status: "running",
        started_at: new Date().toISOString(),
        config: { depth: depth[0], rateLimit, respectRobots, paths: selectedPaths },
      })
      .select()
      .single();

    if (scanError) {
      toast({ title: "Error", description: scanError.message, variant: "destructive" });
      setScanning(false);
      return;
    }

    setCurrentScanId(scanData.id);

    // Simulate progressive scan
    const results: typeof mockEndpoints = [];
    for (let i = 0; i < mockEndpoints.length; i++) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      const ep = mockEndpoints[i];
      results.push(ep);
      setScanResults([...results]);
      setProgress(Math.round(((i + 1) / mockEndpoints.length) * 100));

      const riskTag = ep.risk_level === "critical" || ep.risk_level === "high" ? "⚠️" : "✓";
      addTerminalLine(`[FOUND] ${riskTag} ${ep.method} ${ep.endpoint} → ${ep.response_code} (${ep.risk_level})`);

      // Insert result
      await supabase.from("scan_results").insert({
        scan_id: scanData.id,
        endpoint: ep.endpoint,
        method: ep.method,
        auth_required: ep.auth_required,
        risk_level: ep.risk_level,
        response_code: ep.response_code,
      });
    }

    // Mark scan as completed
    await supabase
      .from("scans")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", scanData.id);

    addTerminalLine(`[DONE] Scan complete. Found ${results.length} endpoints.`);
    addTerminalLine(`[INFO] ${results.filter((r) => r.risk_level === "high" || r.risk_level === "critical").length} high/critical risk findings.`);
    setScanning(false);
    queryClient.invalidateQueries({ queryKey: ["approved-authorizations"] });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(scanResults, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scan-${selectedDomain}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = "Endpoint,Method,Auth Required,Risk Level,Response Code\n";
    const rows = scanResults.map((r) => `${r.endpoint},${r.method},${r.auth_required},${r.risk_level},${r.response_code}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scan-${selectedDomain}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopBar />

          <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4 animate-fade-in">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="gradient-text">API Discovery Scanner</span>
                </h1>
                <p className="text-muted-foreground mt-1">Discover and map API endpoints on authorized targets</p>
              </div>
              {selectedAuth ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Authorized
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Select a target
                </span>
              )}
            </div>

            {/* Target Selection + Config */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Target */}
              <div className="glass-card p-5 space-y-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
                <h3 className="font-semibold text-foreground text-sm">Target Selection</h3>
                {approvedAuths.length === 0 ? (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No authorized targets</p>
                    <p className="text-xs text-muted-foreground mt-1">Go to Authorization Center to add one</p>
                  </div>
                ) : (
                  <>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                      <SelectTrigger className="bg-muted/30 border-border/50">
                        <SelectValue placeholder="Select authorized domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvedAuths.map((auth: any) => (
                          <SelectItem key={auth.id} value={auth.target_domain}>
                            {auth.target_domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedAuth?.expires_at && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {format(new Date(selectedAuth.expires_at), "PP")}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Config */}
              <div className="lg:col-span-2 glass-card p-5 space-y-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h3 className="font-semibold text-foreground text-sm">Scan Configuration</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Depth */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-muted-foreground">
                      Depth: <span className="text-foreground font-semibold">{depth[0]} level{depth[0] > 1 ? "s" : ""}</span>
                    </label>
                    <Slider
                      value={depth}
                      onValueChange={setDepth}
                      min={1}
                      max={3}
                      step={1}
                      className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground">Rate Limit (1 req/sec)</label>
                      <Switch checked={rateLimit} onCheckedChange={setRateLimit} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground">Respect robots.txt</label>
                      <Switch checked={respectRobots} onCheckedChange={setRespectRobots} />
                    </div>
                  </div>
                </div>

                {/* Common paths */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Common Paths</label>
                  <div className="flex flex-wrap gap-2">
                    {commonPaths.map((p) => (
                      <label
                        key={p.path}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer border transition-all",
                          selectedPaths.includes(p.path)
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-muted/30 border-border/30 text-muted-foreground hover:border-primary/20"
                        )}
                      >
                        <Checkbox
                          checked={selectedPaths.includes(p.path)}
                          onCheckedChange={(checked) => {
                            setSelectedPaths((prev) =>
                              checked ? [...prev, p.path] : prev.filter((pp) => pp !== p.path)
                            );
                          }}
                          className="h-3 w-3"
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  onClick={startScan}
                  disabled={!selectedDomain || scanning}
                  className="w-full glow-button bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold h-11"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scanning... {progress}%
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start API Discovery
                    </>
                  )}
                </Button>

                {/* Progress bar */}
                {scanning && (
                  <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {(scanResults.length > 0 || terminalLines.length > 0) && (
              <div className="glass-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
                {/* Results Header */}
                <div className="p-5 border-b border-border/50 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">
                      Results {scanResults.length > 0 && `(${scanResults.length})`}
                    </h3>
                    {scanning && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        Scanning...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className={cn("h-7 text-xs", viewMode === "table" ? "text-primary" : "text-muted-foreground")}
                    >
                      <TableIcon className="h-3.5 w-3.5 mr-1" /> Table
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("terminal")}
                      className={cn("h-7 text-xs", viewMode === "terminal" ? "text-primary" : "text-muted-foreground")}
                    >
                      <Terminal className="h-3.5 w-3.5 mr-1" /> Terminal
                    </Button>
                    {scanResults.length > 0 && (
                      <>
                        <Button variant="ghost" size="sm" onClick={exportJSON} className="h-7 text-xs text-muted-foreground">
                          <Download className="h-3.5 w-3.5 mr-1" /> JSON
                        </Button>
                        <Button variant="ghost" size="sm" onClick={exportCSV} className="h-7 text-xs text-muted-foreground">
                          <Download className="h-3.5 w-3.5 mr-1" /> CSV
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {viewMode === "terminal" ? (
                  <div
                    ref={terminalRef}
                    className="bg-background/80 p-4 font-mono text-xs max-h-96 overflow-auto space-y-0.5"
                  >
                    {terminalLines.map((line, i) => (
                      <div
                        key={i}
                        className={cn(
                          "leading-relaxed",
                          line.includes("⚠️") ? "text-destructive" : line.includes("✓") ? "text-green-400" : line.includes("[INFO]") ? "text-muted-foreground" : line.includes("$") ? "text-primary" : "text-foreground"
                        )}
                      >
                        {line}
                      </div>
                    ))}
                    {scanning && (
                      <div className="text-primary animate-pulse">█</div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left p-3 text-muted-foreground font-medium">Endpoint</th>
                          <th className="text-left p-3 text-muted-foreground font-medium">Method</th>
                          <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Auth</th>
                          <th className="text-left p-3 text-muted-foreground font-medium">Risk</th>
                          <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Code</th>
                          <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanResults.map((result, i) => {
                          const risk = riskConfig[result.risk_level] ?? riskConfig.low;
                          return (
                            <tr key={i} className="border-b border-border/20 hover:bg-muted/20 transition-colors animate-fade-in">
                              <td className="p-3 font-mono text-xs text-foreground">{result.endpoint}</td>
                              <td className="p-3">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground">
                                  {result.method}
                                </span>
                              </td>
                              <td className="p-3 hidden sm:table-cell">
                                {result.auth_required ? (
                                  <Lock className="h-3.5 w-3.5 text-yellow-400" />
                                ) : (
                                  <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                              </td>
                              <td className="p-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${risk.badge}`}>
                                  {result.risk_level}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                                {result.response_code}
                              </td>
                              <td className="p-3">
                                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary hover:text-primary/80">
                                  <Plus className="h-3 w-3 mr-1" /> Report
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ApiDiscovery;
