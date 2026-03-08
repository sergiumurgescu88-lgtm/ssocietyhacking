import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Search,
  Bug,
  BarChart3,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ShieldCheck, label: "Authorization", path: "/dashboard/authorization" },
  { icon: Search, label: "API Scanner", path: "/dashboard/api-scanner" },
  { icon: Bug, label: "Vulnerability Scan", path: "/dashboard/vulnerability" },
  { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
  { icon: BookOpen, label: "Remediation", path: "/dashboard/remediation" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold gradient-text whitespace-nowrap">
              SSocietySafe
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  onClick={() => navigate(item.path)}
                  isActive={isActive}
                  tooltip={item.label}
                  className={
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-primary border border-primary/20 hover:from-primary/25 hover:to-secondary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-[0_0_12px_hsl(166_100%_42%/0.15)] transition-shadow"
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenuButton
          onClick={toggleSidebar}
          tooltip={collapsed ? "Expand" : "Collapse"}
          className="text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronLeft className="h-4 w-4 shrink-0" />
          )}
          <span>Collapse</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
