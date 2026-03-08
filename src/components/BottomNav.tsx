import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Bug,
  BarChart3,
  Settings,
  ShieldCheck,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const mainItems = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: Bug, label: "Scan", path: "/dashboard/vulnerability" },
  { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
  { icon: BookOpen, label: "Guides", path: "/dashboard/remediation" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const moreItems = [
  { icon: ShieldCheck, label: "Authorization", path: "/dashboard/authorization" },
  { icon: Search, label: "API Scanner", path: "/dashboard/api-scanner" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div className="absolute bottom-20 left-4 right-4 bg-card border border-border/50 rounded-2xl p-3 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-2 px-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">More</p>
              <button onClick={() => setMoreOpen(false)} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            {moreItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMoreOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors min-h-[48px] ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground active:bg-muted/50"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] rounded-xl transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground active:text-foreground"
                }`}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
