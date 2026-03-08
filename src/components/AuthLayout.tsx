import { Shield, Wifi } from "lucide-react";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-secondary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="relative flex items-center justify-center w-11 h-11">
            <Shield className="h-8 w-8 text-primary drop-shadow-[0_0_12px_hsl(166,100%,42%,0.4)]" />
            <Wifi className="absolute h-3.5 w-3.5 text-secondary bottom-0 right-0" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">SSociety</span>
            <span className="text-foreground">Safe</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl gradient-border">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
