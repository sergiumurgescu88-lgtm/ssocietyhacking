import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Researcher",
    emoji: "🆓",
    monthly: 0,
    yearly: 0,
    popular: false,
    features: [
      "2 authorized targets",
      "10 scans/month",
      "Basic reports",
      "Community support",
    ],
    cta: "Start Free",
    outline: true,
  },
  {
    name: "Professional",
    emoji: "💼",
    monthly: 79,
    yearly: 63,
    popular: true,
    features: [
      "20 authorized targets",
      "500 scans/month",
      "All report templates",
      "Priority support",
      "API access",
    ],
    cta: "Get Professional",
    outline: false,
  },
  {
    name: "Agency",
    emoji: "🏢",
    monthly: 299,
    yearly: 239,
    popular: false,
    features: [
      "Unlimited targets",
      "Unlimited scans",
      "White-label reports",
      "24/7 support",
      "Team management",
    ],
    cta: "Contact Sales",
    outline: true,
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="relative z-10 py-20 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Start free, scale when you're ready
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 glass-card px-1.5 py-1.5 rounded-full">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="text-[10px] font-bold bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier) => {
            const price = yearly ? tier.yearly : tier.monthly;
            return (
              <div
                key={tier.name}
                className={`group relative flex flex-col glass-card rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
                  tier.popular
                    ? "animated-border p-[1px] md:scale-105"
                    : "border border-border/50"
                }`}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`flex flex-col flex-1 p-7 ${tier.popular ? "bg-card rounded-2xl" : ""}`}>
                  {/* Header */}
                  <div className="mb-6">
                    <span className="text-xl mr-2">{tier.emoji}</span>
                    <span className="text-base font-semibold">{tier.name}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${tier.popular ? "gradient-text" : ""}`}>
                        ${price}
                      </span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                    {yearly && tier.monthly > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="line-through">${tier.monthly}</span> billed yearly
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${tier.popular ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {tier.popular ? (
                    <Button className="w-full glow-button bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold h-11 rounded-xl">
                      {tier.cta}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-border/60 text-foreground hover:bg-muted/30 font-semibold h-11 rounded-xl"
                    >
                      {tier.cta}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
