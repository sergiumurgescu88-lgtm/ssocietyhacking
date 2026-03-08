import { LayoutDashboard, Scan, FileText, Wrench, Settings } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Home", active: true },
  { icon: Scan, label: "Scans" },
  { icon: FileText, label: "Reports" },
  { icon: Wrench, label: "Tools" },
  { icon: Settings, label: "Settings" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/50 bg-card/90 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              item.active
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
