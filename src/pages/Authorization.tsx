import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Building,
  Target,
  FileText,
  Handshake,
  Upload,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const authTypes = [
  {
    id: "domain_ownership",
    icon: Building,
    title: "Domain Ownership",
    description: "DNS TXT record verification or security.txt file upload",
    color: "from-primary/25 to-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "bug_bounty",
    icon: Target,
    title: "Bug Bounty Program",
    description: "HackerOne / Bugcrowd program screenshot & URL",
    color: "from-secondary/25 to-secondary/10",
    iconColor: "text-secondary",
  },
  {
    id: "written_authorization",
    icon: FileText,
    title: "Written Authorization",
    description: "PDF upload with company letterhead",
    color: "from-blue-500/25 to-blue-500/10",
    iconColor: "text-blue-400",
  },
  {
    id: "client_contract",
    icon: Handshake,
    title: "Client Contract",
    description: "Agency verification & contract upload",
    color: "from-green-500/25 to-green-500/10",
    iconColor: "text-green-400",
  },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; badge: string }> = {
  pending: { icon: Clock, color: "text-yellow-400", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  approved: { icon: CheckCircle2, color: "text-green-400", badge: "bg-green-500/15 text-green-400 border-green-500/20" },
  expired: { icon: XCircle, color: "text-destructive", badge: "bg-destructive/15 text-destructive border-destructive/20" },
  rejected: { icon: XCircle, color: "text-destructive", badge: "bg-destructive/15 text-destructive border-destructive/20" },
};

const Authorization = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [targetDomain, setTargetDomain] = useState("");
  const [programUrl, setProgramUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [file, setFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { data: authorizations = [], isLoading } = useQuery({
    queryKey: ["authorizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authorizations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedType || !targetDomain) throw new Error("Missing fields");

      let fileUrl: string | null = null;
      if (file) {
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("authorization-files")
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        fileUrl = filePath;
      }

      const { error } = await supabase.from("authorizations").insert({
        user_id: user.id,
        target_domain: targetDomain.trim(),
        auth_type: selectedType,
        expires_at: expiresAt?.toISOString() ?? null,
        file_url: fileUrl,
        program_url: programUrl.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorizations"] });
      setSelectedType(null);
      setTargetDomain("");
      setProgramUrl("");
      setExpiresAt(undefined);
      setFile(null);
      setConfirmed(false);
      toast({ title: "Authorization submitted", description: "Your request is pending review." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("authorizations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authorizations"] }),
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const authTypeLabel = (t: string) => authTypes.find((a) => a.id === t)?.title ?? t;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopBar />

          <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
            {/* Header */}
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="gradient-text">Authorization Center</span>
              </h1>
              <p className="text-muted-foreground mt-1">Upload proof before scanning any target</p>
            </div>

            {/* Warning Banner */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 animate-fade-in" style={{ animationDelay: "0.05s" }}>
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
              <p className="text-sm font-medium text-yellow-300">
                ⚠️ Scanning without proper authorization is illegal. Always obtain written permission before testing.
              </p>
            </div>

            {/* Authorization Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {authTypes.map((type, i) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                  className={cn(
                    "glass-card p-5 text-left transition-all duration-300 animate-fade-in hover:scale-[1.02]",
                    selectedType === type.id
                      ? "ring-2 ring-primary shadow-[0_0_20px_hsl(166_100%_42%/0.2)]"
                      : "hover:shadow-[0_0_16px_hsl(166_100%_42%/0.1)]"
                  )}
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                    <type.icon className={`h-5 w-5 ${type.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{type.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                </button>
              ))}
            </div>

            {/* Form */}
            {selectedType && (
              <div className="glass-card p-6 space-y-5 animate-fade-in">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Submit Authorization — {authTypeLabel(selectedType)}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Target Domain *</label>
                    <Input
                      placeholder="example.com"
                      value={targetDomain}
                      onChange={(e) => setTargetDomain(e.target.value)}
                      className="bg-muted/30 border-border/50 focus:border-primary/50 focus:shadow-[0_0_12px_hsl(166_100%_42%/0.15)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Expiration Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-muted/30 border-border/50",
                            !expiresAt && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expiresAt ? format(expiresAt, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={expiresAt}
                          onSelect={setExpiresAt}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {selectedType === "bug_bounty" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Program URL</label>
                    <Input
                      placeholder="https://hackerone.com/your-program"
                      value={programUrl}
                      onChange={(e) => setProgramUrl(e.target.value)}
                      className="bg-muted/30 border-border/50 focus:border-primary/50 focus:shadow-[0_0_12px_hsl(166_100%_42%/0.15)]"
                    />
                  </div>
                )}

                {/* File Upload */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/20"
                  )}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  {file ? (
                    <p className="text-sm text-foreground font-medium">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-foreground font-medium">Drop file here or click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, TXT — Max 10MB</p>
                    </>
                  )}
                </div>

                {/* Confirm + Submit */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={confirmed}
                      onCheckedChange={(v) => setConfirmed(v === true)}
                    />
                    <span className="text-sm text-muted-foreground">
                      I confirm I have legal authorization to scan this target
                    </span>
                  </label>
                  <Button
                    onClick={() => submitMutation.mutate()}
                    disabled={!confirmed || !targetDomain.trim() || submitMutation.isPending}
                    className="glow-button bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold px-6"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Authorization"}
                  </Button>
                </div>
              </div>
            )}

            {/* Status Table */}
            <div className="glass-card animate-fade-in" style={{ animationDelay: "0.35s" }}>
              <div className="p-5 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Your Authorizations</h3>
              </div>
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : authorizations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No authorizations yet. Select a type above to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left p-3 text-muted-foreground font-medium">Domain</th>
                        <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Type</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                        <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Expires</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authorizations.map((auth: any) => {
                        const sc = statusConfig[auth.status] ?? statusConfig.pending;
                        const StatusIcon = sc.icon;
                        return (
                          <tr key={auth.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                            <td className="p-3 font-mono text-xs text-foreground">{auth.target_domain}</td>
                            <td className="p-3 text-muted-foreground hidden sm:table-cell">{authTypeLabel(auth.auth_type)}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${sc.badge}`}>
                                <StatusIcon className="h-3 w-3" />
                                {auth.status.charAt(0).toUpperCase() + auth.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground hidden md:table-cell">
                              {auth.expires_at ? format(new Date(auth.expires_at), "PP") : "—"}
                            </td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteMutation.mutate(auth.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Authorization;
