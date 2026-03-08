import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  User, Shield, Key, Bell, CreditCard, ScrollText,
  Camera, Save, Eye, EyeOff, CheckCircle2, XCircle,
  Loader2, Download, Trash2, Monitor, Smartphone,
  Globe, MapPin, Calendar, Search, Filter,
  Zap, Crown, ArrowUpRight, QrCode,
} from "lucide-react";

// ─── Profile Tab ───────────────────────────────────────────────
const ProfileTab = () => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email] = useState(user?.email || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const initials = name ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Avatar</CardTitle>
          <CardDescription>Click to upload a new profile picture</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={avatarPreview || user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg bg-muted">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="h-5 w-5 text-foreground" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          <div>
            <p className="text-sm text-muted-foreground">JPG, PNG or WebP. Max 2MB.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => fileRef.current?.click()}>
              Upload Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={email} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input type={showOld ? "text" : "password"} value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="••••••••" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowOld(!showOld)}>
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="min-w-[140px]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

// ─── Security Tab ──────────────────────────────────────────────
const SecurityTab = () => {
  const [twoFA, setTwoFA] = useState(false);

  const sessions = [
    { device: "Chrome on Windows", icon: Monitor, ip: "192.168.1.105", location: "Bucharest, RO", lastActive: "Now", current: true },
    { device: "Safari on iPhone", icon: Smartphone, ip: "10.0.0.42", location: "Bucharest, RO", lastActive: "2 hours ago", current: false },
    { device: "Firefox on macOS", icon: Monitor, ip: "172.16.0.12", location: "Cluj-Napoca, RO", lastActive: "3 days ago", current: false },
  ];

  const loginHistory = [
    { date: "2026-03-08 14:32", ip: "192.168.1.105", location: "Bucharest, RO", status: "Success" },
    { date: "2026-03-07 09:15", ip: "10.0.0.42", location: "Bucharest, RO", status: "Success" },
    { date: "2026-03-06 22:48", ip: "85.120.44.12", location: "Unknown", status: "Failed" },
    { date: "2026-03-05 11:00", ip: "172.16.0.12", location: "Cluj-Napoca, RO", status: "Success" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" /> Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{twoFA ? "2FA is enabled" : "2FA is disabled"}</p>
              <p className="text-xs text-muted-foreground">Use an authenticator app like Google Authenticator</p>
            </div>
            <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          </div>
          {twoFA && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex flex-col items-center gap-3">
              <div className="w-40 h-40 bg-foreground/10 rounded-lg flex items-center justify-center border border-border/50">
                <QrCode className="h-20 w-20 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground text-center">Scan this QR code with your authenticator app</p>
              <code className="text-xs font-mono bg-muted px-3 py-1.5 rounded">ABCD-EFGH-IJKL-MNOP</code>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    {s.device}
                    {s.current && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/50 text-primary">Current</Badge>}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Globe className="h-3 w-3" />{s.ip} · <MapPin className="h-3 w-3" />{s.location} · {s.lastActive}
                  </p>
                </div>
              </div>
              {!s.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-2 text-muted-foreground font-medium">IP Address</th>
                  <th className="text-left p-2 text-muted-foreground font-medium hidden sm:table-cell">Location</th>
                  <th className="text-left p-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((l, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="p-2 font-mono text-xs">{l.date}</td>
                    <td className="p-2 font-mono text-xs">{l.ip}</td>
                    <td className="p-2 text-xs text-muted-foreground hidden sm:table-cell">{l.location}</td>
                    <td className="p-2">
                      <Badge variant={l.status === "Success" ? "outline" : "destructive"} className={l.status === "Success" ? "border-primary/50 text-primary" : ""}>
                        {l.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── API Keys Tab ──────────────────────────────────────────────
const ApiKeysTab = () => {
  const [keys, setKeys] = useState<Record<string, { value: string; status: "idle" | "testing" | "success" | "error" }>>({
    securitytrails: { value: "", status: "idle" },
    censys: { value: "", status: "idle" },
    shodan: { value: "", status: "idle" },
    urlscan: { value: "", status: "idle" },
  });

  const services = [
    { id: "securitytrails", name: "SecurityTrails", description: "DNS & domain intelligence", color: "text-primary" },
    { id: "censys", name: "Censys", description: "Internet-wide scanning data", color: "text-blue-400" },
    { id: "shodan", name: "Shodan", description: "IoT & server discovery", color: "text-red-400" },
    { id: "urlscan", name: "URLScan.io", description: "Website scanning & analysis", color: "text-yellow-400" },
  ];

  const testKey = async (id: string) => {
    setKeys((prev) => ({ ...prev, [id]: { ...prev[id], status: "testing" } }));
    await new Promise((r) => setTimeout(r, 1500));
    const success = keys[id].value.length > 5;
    setKeys((prev) => ({ ...prev, [id]: { ...prev[id], status: success ? "success" : "error" } }));
    toast({
      title: success ? "Connection successful" : "Connection failed",
      description: success ? `${id} API key is valid` : "Invalid API key. Please check and try again.",
      variant: success ? undefined : "destructive",
    });
  };

  const updateKey = (id: string, value: string) => {
    setKeys((prev) => ({ ...prev, [id]: { value, status: "idle" } }));
  };

  const statusIcon = (status: string) => {
    if (status === "testing") return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (status === "success") return <CheckCircle2 className="h-4 w-4 text-primary" />;
    if (status === "error") return <XCircle className="h-4 w-4 text-destructive" />;
    return <div className="h-4 w-4 rounded-full border-2 border-border" />;
  };

  return (
    <div className="space-y-4">
      {services.map((svc) => (
        <Card key={svc.id} className="border-border/50 bg-card/80 backdrop-blur">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {statusIcon(keys[svc.id].status)}
                <div>
                  <p className={`text-sm font-semibold ${svc.color}`}>{svc.name}</p>
                  <p className="text-xs text-muted-foreground">{svc.description}</p>
                </div>
              </div>
              <Badge variant="outline" className={
                keys[svc.id].status === "success" ? "border-primary/50 text-primary" :
                keys[svc.id].status === "error" ? "border-destructive/50 text-destructive" :
                "border-border text-muted-foreground"
              }>
                {keys[svc.id].status === "success" ? "Connected" : keys[svc.id].status === "error" ? "Failed" : "Not Connected"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder={`Enter ${svc.name} API key`}
                value={keys[svc.id].value}
                onChange={(e) => updateKey(svc.id, e.target.value)}
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testKey(svc.id)}
                disabled={!keys[svc.id].value || keys[svc.id].status === "testing"}
                className="shrink-0"
              >
                {keys[svc.id].status === "testing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Test"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "API keys saved", description: "Your API keys have been securely stored." })}>
          <Save className="h-4 w-4" /> Save All Keys
        </Button>
      </div>
    </div>
  );
};

// ─── Notifications Tab ─────────────────────────────────────────
const NotificationsTab = () => {
  const [prefs, setPrefs] = useState({
    email: true,
    scanComplete: true,
    reportReady: true,
    securityAlerts: true,
    marketing: false,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast({ title: "Preference updated" });
  };

  const items = [
    { key: "email" as const, label: "Email Notifications", desc: "Receive all notifications via email", icon: Bell },
    { key: "scanComplete" as const, label: "Scan Complete Alerts", desc: "Get notified when a scan finishes", icon: CheckCircle2 },
    { key: "reportReady" as const, label: "Report Ready Alerts", desc: "Get notified when a report is generated", icon: ScrollText },
    { key: "securityAlerts" as const, label: "Security Alerts", desc: "Critical vulnerability and breach notifications", icon: Shield },
    { key: "marketing" as const, label: "Marketing Emails", desc: "Product updates, tips and promotions", icon: Zap },
  ];

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, i) => (
          <div key={item.key}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
            </div>
            {i < items.length - 1 && <Separator className="bg-border/30" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// ─── Billing Tab ───────────────────────────────────────────────
const BillingTab = () => {
  const invoices = [
    { id: "INV-2026-003", date: "2026-03-01", amount: "$49.00", status: "Paid" },
    { id: "INV-2026-002", date: "2026-02-01", amount: "$49.00", status: "Paid" },
    { id: "INV-2026-001", date: "2026-01-01", amount: "$49.00", status: "Paid" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Pro Plan</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">$49<span className="text-sm font-normal text-muted-foreground">/month</span></h3>
              <p className="text-xs text-muted-foreground mt-1">Renews on April 1, 2026</p>
            </div>
            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
              <ArrowUpRight className="h-3.5 w-3.5" /> Upgrade
            </Button>
          </div>
          <Separator className="my-4 bg-border/30" />
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Scans Used</span>
                <span className="text-foreground font-medium">847 / 1,000</span>
              </div>
              <Progress value={84.7} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Reports Generated</span>
                <span className="text-foreground font-medium">12 / 50</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="h-9 w-14 rounded bg-muted/50 flex items-center justify-center text-xs font-bold text-muted-foreground">VISA</div>
              <div>
                <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2028</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-2 text-muted-foreground font-medium">Invoice</th>
                  <th className="text-left p-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-2 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left p-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-right p-2 text-muted-foreground font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/20">
                    <td className="p-2 font-mono text-xs">{inv.id}</td>
                    <td className="p-2 text-xs text-muted-foreground">{inv.date}</td>
                    <td className="p-2 text-xs font-medium text-foreground">{inv.amount}</td>
                    <td className="p-2"><Badge variant="outline" className="border-primary/50 text-primary text-[10px]">{inv.status}</Badge></td>
                    <td className="p-2 text-right">
                      <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Audit Log Tab ─────────────────────────────────────────────
const AuditLogTab = () => {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const logs = [
    { action: "Scan started", target: "api.example.com", ip: "192.168.1.105", date: "2026-03-08 14:32:10", user: "you" },
    { action: "Report exported", target: "Q1 Security Audit", ip: "192.168.1.105", date: "2026-03-08 12:15:44", user: "you" },
    { action: "Authorization created", target: "payments.store.co", ip: "10.0.0.42", date: "2026-03-07 09:30:22", user: "you" },
    { action: "API key updated", target: "SecurityTrails", ip: "192.168.1.105", date: "2026-03-06 18:45:00", user: "you" },
    { action: "Password changed", target: "Account", ip: "172.16.0.12", date: "2026-03-05 11:02:33", user: "you" },
    { action: "Login", target: "Dashboard", ip: "85.120.44.12", date: "2026-03-05 10:58:12", user: "you" },
    { action: "Report deleted", target: "Old Draft Report", ip: "192.168.1.105", date: "2026-03-04 16:20:00", user: "you" },
    { action: "Scan completed", target: "auth.myapp.io", ip: "10.0.0.42", date: "2026-03-03 08:12:55", user: "you" },
  ];

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || l.action.toLowerCase().includes(q) || l.target.toLowerCase().includes(q) || l.ip.includes(q);
    const matchesFrom = !dateFrom || l.date >= dateFrom;
    const matchesTo = !dateTo || l.date <= dateTo + " 23:59:59";
    return matchesSearch && matchesFrom && matchesTo;
  });

  const exportCSV = () => {
    const header = "Action,Target,IP Address,Date,User\n";
    const rows = filtered.map((l) => `${l.action},${l.target},${l.ip},${l.date},${l.user}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Audit log exported as CSV" });
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Audit Log</CardTitle>
            <CardDescription>Track all activity on your account</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search actions, targets, IPs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-auto text-xs" />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-auto text-xs" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-2 text-muted-foreground font-medium">Action</th>
                <th className="text-left p-2 text-muted-foreground font-medium hidden sm:table-cell">Target</th>
                <th className="text-left p-2 text-muted-foreground font-medium hidden md:table-cell">IP Address</th>
                <th className="text-left p-2 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="p-2 text-xs font-medium text-foreground">{l.action}</td>
                  <td className="p-2 text-xs text-muted-foreground hidden sm:table-cell">{l.target}</td>
                  <td className="p-2 font-mono text-xs text-muted-foreground hidden md:table-cell">{l.ip}</td>
                  <td className="p-2 font-mono text-xs text-muted-foreground">{l.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground text-sm">No matching entries found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Settings Page ─────────────────────────────────────────────
const Settings = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const tabs = [
    { value: "profile", label: "Profile", icon: User },
    { value: "security", label: "Security", icon: Shield },
    { value: "api-keys", label: "API Keys", icon: Key },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "billing", label: "Billing", icon: CreditCard },
    { value: "audit", label: "Audit Log", icon: ScrollText },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopBar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="mb-6 animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account preferences</p>
            </div>

            <Tabs defaultValue="profile" className="animate-fade-in">
              <TabsList className="bg-muted/50 border border-border/30 mb-6 flex-wrap h-auto gap-1 p-1">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground text-xs sm:text-sm">
                    <tab.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="profile"><ProfileTab /></TabsContent>
              <TabsContent value="security"><SecurityTab /></TabsContent>
              <TabsContent value="api-keys"><ApiKeysTab /></TabsContent>
              <TabsContent value="notifications"><NotificationsTab /></TabsContent>
              <TabsContent value="billing"><BillingTab /></TabsContent>
              <TabsContent value="audit"><AuditLogTab /></TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
