import { Shield, Wifi, ArrowRight, Play, Users, Bug, Clock, ShieldCheck, ChevronDown, Search, Scan, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetworkBackground from "@/components/NetworkBackground";
import FloatingShields from "@/components/FloatingShields";

const Index = () => {
  return (
    <div className="flex-1 pb-20 lg:pb-0">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Animated background */}
        <NetworkBackground />
        <FloatingShields />

        {/* Gradient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in">
          {/* Logo mark */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative flex items-center justify-center w-14 h-14">
              <Shield className="h-11 w-11 text-primary drop-shadow-[0_0_15px_hsl(166,100%,42%,0.4)]" />
              <Wifi className="absolute h-4.5 w-4.5 text-secondary bottom-0.5 right-0" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="gradient-text">SSociety</span>
              <span className="text-foreground">Safe</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Protecting Digital{" "}
            <span className="gradient-text">Society</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Ethical security research platform for authorized testing
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="glow-button bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold px-8 h-12 text-base rounded-xl"
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/60 text-foreground hover:bg-muted/30 font-semibold px-8 h-12 text-base rounded-xl"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow z-10">
          <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="relative z-10 border-y border-border/50 bg-card/40 backdrop-blur-xl">
        <div className="container py-8 px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Users, value: "500+", label: "Security Researchers" },
              { icon: Bug, value: "10,000+", label: "Vulnerabilities Found" },
              { icon: Clock, value: "99.9%", label: "Platform Uptime" },
              { icon: ShieldCheck, value: "✓", label: "GDPR Compliant" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors shrink-0">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
