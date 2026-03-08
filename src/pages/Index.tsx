import { Shield, ArrowRight, Activity, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8 animate-fade-in">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="glass-card p-8 lg:p-12 gradient-border overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Activity className="h-3 w-3" />
              Platform Active
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
              Ethical Security{" "}
              <span className="gradient-text">Research Platform</span>
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg mb-8 max-w-lg">
              Discover vulnerabilities responsibly. Protect systems ethically. Build a safer digital world together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6">
                Start Scanning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-border/50 text-foreground hover:bg-muted/50 font-semibold px-6">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Shield, label: "Vulnerabilities Found", value: "12,847", color: "text-primary" },
          { icon: Lock, label: "Systems Secured", value: "3,291", color: "text-secondary" },
          { icon: Globe, label: "Active Researchers", value: "1,058", color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 gradient-border group hover:bg-card/80 transition-colors">
            <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { severity: "Critical", target: "api.example.com", type: "SQL Injection", time: "2 min ago" },
            { severity: "Medium", target: "cdn.testsite.io", type: "XSS Reflected", time: "15 min ago" },
            { severity: "Low", target: "auth.demo.net", type: "Info Disclosure", time: "1 hour ago" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  item.severity === "Critical" ? "bg-destructive animate-pulse-glow" :
                  item.severity === "Medium" ? "bg-yellow-500" : "bg-primary"
                }`} />
                <div>
                  <p className="text-sm font-medium">{item.type}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.target}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  item.severity === "Critical" ? "bg-destructive/10 text-destructive" :
                  item.severity === "Medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-primary/10 text-primary"
                }`}>
                  {item.severity}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
