import { Shield, Wifi, ArrowRight, Play, Users, Bug, Clock, ShieldCheck, ChevronDown, Search, Scan, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NetworkBackground from "@/components/NetworkBackground";
import FloatingShields from "@/components/FloatingShields";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";

const Index = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 pb-20 lg:pb-0">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center overflow-hidden px-4">
        <NetworkBackground />
        <FloatingShields />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in">
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

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="glow-button bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold px-8 h-12 text-base rounded-xl"
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFeatures}
              className="border-border/60 text-foreground hover:bg-muted/30 font-semibold px-8 h-12 text-base rounded-xl"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              See How It Works
            </Button>
          </div>
        </div>

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

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need for responsible security research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                secondaryIcon: Wifi,
                title: "API Discovery",
                description: "Find exposed endpoints safely",
                gradient: "from-primary to-primary/60",
                glowColor: "hsl(166 100% 42% / 0.35)",
                iconBg: "bg-primary/10 border-primary/20",
                iconColor: "text-primary",
                link: "/dashboard/api-scanner",
              },
              {
                icon: Shield,
                secondaryIcon: Scan,
                title: "Vulnerability Detection",
                description: "Non-destructive security scans",
                gradient: "from-secondary to-secondary/60",
                glowColor: "hsl(255 100% 69% / 0.35)",
                iconBg: "bg-secondary/10 border-secondary/20",
                iconColor: "text-secondary",
                link: "/dashboard/vulnerability",
              },
              {
                icon: FileCheck,
                secondaryIcon: ShieldCheck,
                title: "Professional Reports",
                description: "Bug bounty ready format",
                gradient: "from-[hsl(210,100%,60%)] to-[hsl(210,100%,40%)]",
                glowColor: "hsl(210 100% 60% / 0.35)",
                iconBg: "bg-[hsl(210,100%,60%)]/10 border-[hsl(210,100%,60%)]/20",
                iconColor: "text-[hsl(210,100%,60%)]",
                link: "/dashboard/reports",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                onClick={() => navigate(feature.link)}
                className="group relative glass-card p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 animated-border cursor-pointer"
                style={{
                  // @ts-ignore
                  "--hover-glow": feature.glowColor,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px -10px ${feature.glowColor}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl border ${feature.iconBg} mb-6 transition-transform duration-500 group-hover:scale-110`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor} transition-transform duration-500 group-hover:rotate-[-8deg]`} />
                  <feature.secondaryIcon className={`absolute -bottom-1 -right-1 h-4 w-4 ${feature.iconColor} opacity-60`} />
                </div>

                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

                <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ArrowRight className="h-3.5 w-3.5" />
                </div>

                <div className={`absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Pricing */}
      <Pricing />
    </div>
  );
};

export default Index;
