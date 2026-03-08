import { FileCheck as FileCheckIcon, Target, Radar, Send, FileText } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: FileCheckIcon,
    title: "Verify Authorization",
    short: "Upload proof of ownership",
    details: "Wait for approval before any testing begins",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    glow: "group-hover:shadow-[0_0_30px_hsl(166,100%,42%,0.25)]",
  },
  {
    num: "02",
    icon: Target,
    title: "Select Target",
    short: "Choose from authorized domains",
    details: "Configure scan parameters to your needs",
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/20",
    glow: "group-hover:shadow-[0_0_30px_hsl(255,100%,69%,0.25)]",
  },
  {
    num: "03",
    icon: Radar,
    title: "Run Security Scan",
    short: "API discovery + vulnerability check",
    details: "Real-time progress monitoring",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    glow: "group-hover:shadow-[0_0_30px_hsl(166,100%,42%,0.25)]",
  },
  {
    num: "04",
    icon: Send,
    secondaryIcon: FileText,
    title: "Generate Report",
    short: "Professional PDF export",
    details: "Send directly to security team",
    color: "text-secondary",
    bg: "bg-secondary/10 border-secondary/20",
    glow: "group-hover:shadow-[0_0_30px_hsl(255,100%,69%,0.25)]",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative z-10 py-20 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Secure Workflow in <span className="gradient-text">4 Steps</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From authorization to report — a complete ethical testing pipeline
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block">
          {/* Animated connecting line */}
          <div className="relative mx-auto max-w-4xl mb-10">
            <div className="absolute top-7 left-[12%] right-[12%] h-px bg-border/40" />
            <div className="absolute top-7 left-[12%] right-[12%] h-px timeline-line" />
          </div>

          <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.num} className={`group flex flex-col items-center text-center transition-all duration-500 ${step.glow} rounded-2xl p-6`}>
                {/* Step number */}
                <span className={`text-xs font-mono font-bold ${step.color} mb-4 tracking-widest`}>
                  STEP {step.num}
                </span>

                {/* Icon */}
                <div className={`relative flex items-center justify-center w-14 h-14 rounded-xl border ${step.bg} mb-5 transition-transform duration-500 group-hover:scale-110`}>
                  <step.icon className={`h-6 w-6 ${step.color} transition-transform duration-300 group-hover:rotate-[-6deg]`} />
                </div>

                <h3 className="text-sm font-semibold mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-1">{step.short}</p>

                {/* Hover reveal details */}
                <p className="text-xs text-muted-foreground/0 group-hover:text-muted-foreground/80 transition-all duration-500 max-h-0 group-hover:max-h-12 overflow-hidden">
                  {step.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-7 w-px bg-border/40" />
          <div className="absolute top-0 bottom-0 left-7 w-px timeline-line-vertical" />

          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.num} className="group relative flex gap-5 pl-16">
                {/* Node dot */}
                <div className={`absolute left-5 top-1 w-5 h-5 rounded-full border-2 ${step.bg} ${step.color} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full bg-current`} />
                </div>

                <div className={`glass-card p-5 rounded-xl flex-1 transition-all duration-500 ${step.glow}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${step.bg}`}>
                      <step.icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <div>
                      <span className={`text-[10px] font-mono font-bold ${step.color} tracking-widest`}>STEP {step.num}</span>
                      <h3 className="text-sm font-semibold">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.short}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{step.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
