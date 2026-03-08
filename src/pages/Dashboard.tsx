import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { DashboardStatsCards } from "@/components/DashboardStatsCards";
import {
  Scan,
  Bug,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
} from "lucide-react";

const stats = [
  {
    label: "Total Scans",
    value: "1,284",
    change: "+12%",
    icon: Scan,
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    label: "Vulnerabilities",
    value: "47",
    change: "-8%",
    icon: Bug,
    color: "from-destructive/20 to-destructive/5",
    iconColor: "text-destructive",
  },
  {
    label: "Resolved",
    value: "1,102",
    change: "+23%",
    icon: CheckCircle2,
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-400",
  },
  {
    label: "Reports",
    value: "89",
    change: "+5%",
    icon: BarChart3,
    color: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
];

const recentScans = [
  { target: "api.example.com", type: "Full Scan", status: "Completed", severity: "Low", date: "2 hours ago" },
  { target: "auth.myapp.io", type: "Auth Check", status: "In Progress", severity: "Medium", date: "5 hours ago" },
  { target: "payments.store.co", type: "Vuln Scan", status: "Completed", severity: "Critical", date: "1 day ago" },
  { target: "cdn.webapp.dev", type: "API Scan", status: "Completed", severity: "None", date: "2 days ago" },
  { target: "admin.portal.net", type: "Full Scan", status: "Failed", severity: "High", date: "3 days ago" },
];

const severityColor: Record<string, string> = {
  Critical: "bg-destructive/20 text-destructive",
  High: "bg-orange-500/20 text-orange-400",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Low: "bg-primary/20 text-primary",
  None: "bg-muted text-muted-foreground",
};

const statusColor: Record<string, string> = {
  Completed: "text-green-400",
  "In Progress": "text-yellow-400",
  Failed: "text-destructive",
};

const quickActions = [
  { label: "New API Scan", icon: Scan, description: "Scan an API endpoint" },
  { label: "Vulnerability Check", icon: Bug, description: "Run vulnerability assessment" },
  { label: "Generate Report", icon: BarChart3, description: "Create security report" },
  { label: "Quick Fix", icon: Zap, description: "Apply recommended patches" },
];

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopBar />

          <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
            {/* Welcome */}
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, <span className="gradient-text">{displayName}</span>
              </h1>
              <p className="text-muted-foreground mt-1">Here's your security overview</p>
            </div>

            {/* Authorization Status */}
            <div className="glass-card p-5 gradient-border animate-fade-in" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Authorization Active</h2>
                    <p className="text-sm text-muted-foreground">
                      Your security scanner is authorized and running
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Verified
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="glass-card p-5 hover:shadow-[var(--shadow-glow-primary)] transition-shadow duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium text-primary">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Scans & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Scans Table */}
              <div className="lg:col-span-2 glass-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="p-5 border-b border-border/50 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Recent Scans</h3>
                  <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left p-3 text-muted-foreground font-medium">Target</th>
                        <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Type</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                        <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Severity</th>
                        <th className="text-left p-3 text-muted-foreground font-medium hidden lg:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentScans.map((scan, i) => (
                        <tr key={i} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-mono text-xs text-foreground">{scan.target}</td>
                          <td className="p-3 text-muted-foreground hidden sm:table-cell">{scan.type}</td>
                          <td className="p-3">
                            <span className={`flex items-center gap-1.5 ${statusColor[scan.status]}`}>
                              {scan.status === "Completed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                              {scan.status === "In Progress" && <Clock className="h-3.5 w-3.5 animate-spin" />}
                              {scan.status === "Failed" && <AlertTriangle className="h-3.5 w-3.5" />}
                              {scan.status}
                            </span>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor[scan.severity]}`}>
                              {scan.severity}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground hidden lg:table-cell">{scan.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "0.35s" }}>
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 hover:bg-muted/50 hover:shadow-[0_0_12px_hsl(166_100%_42%/0.1)] transition-all duration-200 text-left group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-secondary/20 transition-colors">
                        <action.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{action.label}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
