import { AppSidebarNav } from "./AppSidebarNav";

const DesktopSidebar = () => {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/50 bg-card/40 backdrop-blur-sm">
      <AppSidebarNav />
      <div className="mt-auto p-4">
        <div className="glass-card p-4 gradient-border">
          <p className="text-xs font-semibold text-primary mb-1">Pro Plan</p>
          <p className="text-xs text-muted-foreground">Unlimited scans & reports</p>
          <button className="mt-3 w-full py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground glow-button">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
