import {
  LayoutDashboard,
  Scan,
  FileText,
  Wrench,
  Settings,
  Users,
  BookOpen,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Scan, label: "Scans" },
  { icon: FileText, label: "Reports" },
  { icon: Wrench, label: "Tools" },
  { icon: Users, label: "Community" },
  { icon: BookOpen, label: "Knowledge Base" },
  { icon: Settings, label: "Settings" },
];

export const AppSidebarNav = () => {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            item.active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <item.icon className="h-4.5 w-4.5 shrink-0" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
