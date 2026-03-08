import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import BottomNav from "@/components/BottomNav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Plus,
  FileText,
  Download,
  Send,
  Trash2,
  Eye,
  X,
  Upload,
  FileDown,
  Code,
  Type,
  Target,
  Briefcase,
  BarChart3,
  Wrench,
  ChevronLeft,
  Edit3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const templates = [
  { id: "bug_bounty", label: "Bug Bounty Report", desc: "HackerOne / Bugcrowd format", icon: Target },
  { id: "client_report", label: "Client Report", desc: "Professional PDF with branding", icon: Briefcase },
  { id: "executive_summary", label: "Executive Summary", desc: "High-level overview for leadership", icon: BarChart3 },
  { id: "technical", label: "Technical Report", desc: "Detailed technical findings", icon: Wrench },
];

const statusConfig: Record<string, { badge: string; label: string }> = {
  draft: { badge: "bg-muted text-muted-foreground border-border/50", label: "Draft" },
  ready: { badge: "bg-green-500/15 text-green-400 border-green-500/20", label: "Ready" },
  sent: { badge: "bg-blue-500/15 text-blue-400 border-blue-500/20", label: "Sent" },
};

// Mock findings for the editor
const mockFindings = [
  { id: 1, severity: "critical", title: "Missing Content-Security-Policy Header", endpoint: "/" },
  { id: 2, severity: "high", title: "CORS Allows Wildcard Origin", endpoint: "/api/v1/users" },
  { id: 3, severity: "high", title: "TLS 1.0/1.1 Supported", endpoint: "*" },
  { id: 4, severity: "medium", title: "Reflected XSS in Search", endpoint: "/search?q=" },
  { id: 5, severity: "medium", title: "Missing X-Frame-Options", endpoint: "/" },
  { id: 6, severity: "low", title: "Missing HSTS Header", endpoint: "/" },
];

const sevColor: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/20",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  low: "bg-green-500/15 text-green-400 border-green-500/20",
};

const Reports = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);

  // New report form
  const [newTitle, setNewTitle] = useState("");
  const [newTemplate, setNewTemplate] = useState("technical");
  const [newCompanyName, setNewCompanyName] = useState("");

  // Editor state
  const [editorFindings, setEditorFindings] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [editorRecs, setEditorRecs] = useState("Implement all recommended fixes prioritized by severity. Start with critical findings and work down to low-severity items.");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user || !newTitle.trim()) throw new Error("Title required");
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        title: newTitle.trim(),
        template: newTemplate,
        company_name: newCompanyName.trim() || null,
        status: "draft",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setShowNewModal(false);
      setNewTitle("");
      setNewTemplate("technical");
      setNewCompanyName("");
      toast({ title: "Report created", description: "Your report draft is ready to edit." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reports").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("reports").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({ title: "Status updated" });
    },
  });

  const exportMarkdown = () => {
    const findings = mockFindings.filter((f) => editorFindings.includes(f.id));
    const md = `# ${editingReport?.title ?? "Security Report"}\n\n**Company:** ${editingReport?.company_name ?? "N/A"}\n**Template:** ${templates.find((t) => t.id === editingReport?.template)?.label ?? ""}\n**Date:** ${format(new Date(), "PPP")}\n\n---\n\n## Findings\n\n${findings.map((f, i) => `### ${i + 1}. ${f.title}\n- **Severity:** ${f.severity}\n- **Endpoint:** \`${f.endpoint}\`\n`).join("\n")}\n## Recommendations\n\n${editorRecs}\n`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${editingReport?.title ?? "report"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHTML = () => {
    const findings = mockFindings.filter((f) => editorFindings.includes(f.id));
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${editingReport?.title ?? "Report"}</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a2e;}.header{border-bottom:2px solid #00d4aa;padding-bottom:20px;margin-bottom:30px;}.severity{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;}.critical{background:#fee;color:#d00;}.high{background:#fff3e0;color:#e65100;}.medium{background:#fff9c4;color:#f57f17;}.low{background:#e8f5e9;color:#2e7d32;}.finding{border-left:3px solid #ccc;padding:12px 16px;margin:16px 0;background:#f8f9fa;}</style></head><body><div class="header"><h1>${editingReport?.title ?? "Security Report"}</h1><p><strong>Company:</strong> ${editingReport?.company_name ?? "N/A"} | <strong>Date:</strong> ${format(new Date(), "PPP")}</p></div>${findings.map((f) => `<div class="finding"><span class="severity ${f.severity}">${f.severity.toUpperCase()}</span><h3>${f.title}</h3><code>${f.endpoint}</code></div>`).join("")}<h2>Recommendations</h2><p>${editorRecs}</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${editingReport?.title ?? "report"}.html`;
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

  // Report Editor View
  if (editingReport) {
    const tpl = templates.find((t) => t.id === editingReport.template);
    const findings = mockFindings.filter((f) => editorFindings.includes(f.id));

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <DashboardTopBar />
            <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
              {/* Editor Header */}
              <div className="flex items-center justify-between flex-wrap gap-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setEditingReport(null)} className="h-8 w-8 text-muted-foreground">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{editingReport.title}</h1>
                    <p className="text-xs text-muted-foreground">{tpl?.label} • {editingReport.company_name || "No company"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={exportMarkdown} className="text-xs text-muted-foreground h-8">
                    <Type className="h-3.5 w-3.5 mr-1" /> Markdown
                  </Button>
                  <Button variant="ghost" size="sm" onClick={exportHTML} className="text-xs text-muted-foreground h-8">
                    <Code className="h-3.5 w-3.5 mr-1" /> HTML
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateStatusMutation.mutate({ id: editingReport.id, status: "ready" })}
                    className="h-8 text-xs bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Ready
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editor Panel */}
                <div className="space-y-4">
                  {/* Findings Selection */}
                  <div className="glass-card p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Edit3 className="h-3.5 w-3.5 text-primary" /> Findings ({editorFindings.length})
                    </h3>
                    <div className="space-y-2">
                      {mockFindings.map((f) => {
                        const included = editorFindings.includes(f.id);
                        return (
                          <label
                            key={f.id}
                            className={cn(
                              "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                              included ? "bg-muted/30 border-primary/20" : "border-border/20 opacity-50"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={included}
                              onChange={() =>
                                setEditorFindings((prev) =>
                                  included ? prev.filter((id) => id !== f.id) : [...prev, f.id]
                                )
                              }
                              className="rounded border-border"
                            />
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${sevColor[f.severity]}`}>
                              {f.severity}
                            </span>
                            <span className="text-foreground text-xs flex-1">{f.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="glass-card p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Custom Recommendations</h3>
                    <Textarea
                      value={editorRecs}
                      onChange={(e) => setEditorRecs(e.target.value)}
                      rows={4}
                      className="bg-muted/30 border-border/50 text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="glass-card p-6 space-y-5 bg-card/80">
                  <div className="border-b border-border/30 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-secondary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{editingReport.company_name || "SSocietySafe"}</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{editingReport.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{tpl?.label} • Generated {format(new Date(), "PPP")}</p>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Executive Summary</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This security assessment identified <strong className="text-foreground">{findings.length} findings</strong> across
                      the target infrastructure. Of these, {findings.filter((f) => f.severity === "critical").length} are critical
                      and {findings.filter((f) => f.severity === "high").length} are high severity, requiring immediate attention.
                    </p>
                  </div>

                  {/* Findings Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Findings</h3>
                    <div className="space-y-2">
                      {findings.map((f, i) => (
                        <div key={f.id} className="flex items-center gap-2 p-2 rounded border border-border/20 bg-muted/10">
                          <span className="text-[10px] font-mono text-muted-foreground w-5">{i + 1}.</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${sevColor[f.severity]}`}>
                            {f.severity}
                          </span>
                          <span className="text-xs text-foreground flex-1 truncate">{f.title}</span>
                          <code className="text-[10px] text-muted-foreground hidden sm:block">{f.endpoint}</code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Recommendations</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{editorRecs}</p>
                  </div>

                  <div className="border-t border-border/30 pt-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Confidential — Generated by SSocietySafe</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Reports List View
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
                  <span className="gradient-text">Security Reports</span>
                </h1>
                <p className="text-muted-foreground mt-1">Generate and manage security assessment reports</p>
              </div>
              <Button
                onClick={() => setShowNewModal(true)}
                className="glow-button bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" /> New Report
              </Button>
            </div>

            {/* Reports Table */}
            <div className="glass-card animate-fade-in" style={{ animationDelay: "0.05s" }}>
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : reports.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No reports yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first report to get started</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                        <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Created</th>
                        <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Type</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report: any) => {
                        const st = statusConfig[report.status] ?? statusConfig.draft;
                        const tpl = templates.find((t) => t.id === report.template);
                        return (
                          <tr key={report.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                            <td className="p-3">
                              <p className="text-foreground font-medium text-sm">{report.title}</p>
                              {report.company_name && (
                                <p className="text-xs text-muted-foreground">{report.company_name}</p>
                              )}
                            </td>
                            <td className="p-3 text-muted-foreground text-xs hidden sm:table-cell">
                              {format(new Date(report.created_at), "PP")}
                            </td>
                            <td className="p-3 text-muted-foreground text-xs hidden md:table-cell">
                              {tpl?.label ?? report.template}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.badge}`}>
                                {st.label}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setEditingReport(report)}>
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => { setEditingReport(report); setTimeout(exportHTML, 100); }}>
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                                  onClick={() => updateStatusMutation.mutate({ id: report.id, status: "sent" })}
                                >
                                  <Send className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate(report.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* New Report Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="bg-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Report Title *</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Q1 2026 Security Assessment"
                className="bg-muted/30 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Template</label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setNewTemplate(t.id)}
                    className={cn(
                      "flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all",
                      newTemplate === t.id
                        ? "bg-primary/5 border-primary/30"
                        : "bg-muted/20 border-border/30 hover:border-primary/15"
                    )}
                  >
                    <t.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{t.label}</p>
                      <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <Input
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className="bg-muted/30 border-border/50"
              />
            </div>

            <Button
              onClick={() => createMutation.mutate()}
              disabled={!newTitle.trim() || createMutation.isPending}
              className="w-full glow-button bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
            >
              {createMutation.isPending ? "Creating..." : "Create Report"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Reports;
