import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Shield, Lock, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Stripe price mapping
export const STRIPE_TIERS = {
  researcher: {
    name: "Researcher",
    emoji: "🔬",
    monthly: 29,
    yearly: 23,
    monthlyPriceId: "price_1T8nGELDo9sXtuKJSfxDGfI0",
    yearlyPriceId: "price_1T8nH1LDo9sXtuKJ6p2QGNhT",
    productIds: ["prod_U71I1Nt5ZCypzy", "prod_U71JllIrCmd4Yb"],
    scans: 100,
    popular: false,
    features: [
      "5 authorized targets",
      "100 scans/month",
      "Basic vulnerability scanning",
      "Email reports",
      "Community support",
    ],
    cta: "Start Free Trial",
  },
  professional: {
    name: "Professional",
    emoji: "💼",
    monthly: 79,
    yearly: 63,
    monthlyPriceId: "price_1T8nHsLDo9sXtuKJoZ3sfxcb",
    yearlyPriceId: "price_1T8nIWLDo9sXtuKJqeqmCrv7",
    productIds: ["prod_U71KJPfrlmkmGs", "prod_U71Le24ioB6xoi"],
    scans: 500,
    popular: true,
    features: [
      "20 authorized targets",
      "500 scans/month",
      "Advanced scanning (SQLi, XSS)",
      "All report templates",
      "Priority support",
      "API access",
      "PDF export",
    ],
    cta: "Get Professional",
  },
  agency: {
    name: "Agency",
    emoji: "🏢",
    monthly: 199,
    yearly: 159,
    monthlyPriceId: "price_1T8nIqLDo9sXtuKJxwrr37aL",
    yearlyPriceId: "price_1T8nJFLDo9sXtuKJiuJrmno5",
    productIds: ["prod_U71Lu33X50bnyS", "prod_U71L2zYFZi2bup"],
    scans: -1, // unlimited
    popular: false,
    features: [
      "Unlimited targets",
      "Unlimited scans",
      "White-label reports",
      "Team management",
      "Custom integrations",
      "24/7 dedicated support",
      "API access",
      "SLA guarantee",
    ],
    cta: "Start Free Trial",
  },
} as const;

export type TierKey = keyof typeof STRIPE_TIERS;

export const getTierByProductId = (productId: string): TierKey | null => {
  for (const [key, tier] of Object.entries(STRIPE_TIERS)) {
    if (tier.productIds.includes(productId)) return key as TierKey;
  }
  return null;
};

const featureComparison = [
  { name: "Authorized Targets", researcher: "5", professional: "20", agency: "Unlimited" },
  { name: "Scans per Month", researcher: "100", professional: "500", agency: "Unlimited" },
  { name: "Security Headers Scan", researcher: true, professional: true, agency: true },
  { name: "SSL/TLS Scan", researcher: true, professional: true, agency: true },
  { name: "CORS Check", researcher: true, professional: true, agency: true },
  { name: "SQL Injection Detection", researcher: false, professional: true, agency: true },
  { name: "XSS Detection", researcher: false, professional: true, agency: true },
  { name: "Report Templates", researcher: "Basic", professional: "All", agency: "All + Custom" },
  { name: "PDF Export", researcher: false, professional: true, agency: true },
  { name: "White-label Reports", researcher: false, professional: false, agency: true },
  { name: "API Access", researcher: false, professional: true, agency: true },
  { name: "Team Management", researcher: false, professional: false, agency: true },
  { name: "Support", researcher: "Community", professional: "Priority", agency: "24/7 Dedicated" },
  { name: "SLA Guarantee", researcher: false, professional: false, agency: true },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (tierKey: TierKey) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    const tier = STRIPE_TIERS[tierKey];
    const priceId = yearly ? tier.yearlyPriceId : tier.monthlyPriceId;

    setLoadingTier(tierKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({ title: "Checkout error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingTier(null);
    }
  };

  const tiers = Object.entries(STRIPE_TIERS) as [TierKey, typeof STRIPE_TIERS[TierKey]][];

  return (
    <section className="relative z-10 py-20 px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Start with a 14-day free trial. No credit card required.
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {tiers.map(([key, tier]) => {
            const price = yearly ? tier.yearly : tier.monthly;
            return (
              <div
                key={key}
                className={`group relative flex flex-col glass-card rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
                  tier.popular ? "animated-border p-[1px] md:scale-105" : "border border-border/50"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`flex flex-col flex-1 p-7 ${tier.popular ? "bg-card rounded-2xl" : ""}`}>
                  <div className="mb-6">
                    <span className="text-xl mr-2">{tier.emoji}</span>
                    <span className="text-base font-semibold">{tier.name}</span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${tier.popular ? "gradient-text" : ""}`}>
                        ${price}
                      </span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                    {yearly && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="line-through">${tier.monthly}</span> billed yearly
                      </p>
                    )}
                  </div>

                  <ul className="flex-1 space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${tier.popular ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.popular ? (
                    <Button
                      onClick={() => handleCheckout(key)}
                      disabled={loadingTier === key}
                      className="w-full glow-button bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold h-11 rounded-xl"
                    >
                      {loadingTier === key ? <Loader2 className="h-4 w-4 animate-spin" /> : tier.cta}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleCheckout(key)}
                      disabled={loadingTier === key}
                      className="w-full border-border/60 text-foreground hover:bg-muted/30 font-semibold h-11 rounded-xl"
                    >
                      {loadingTier === key ? <Loader2 className="h-4 w-4 animate-spin" /> : tier.cta}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Feature <span className="gradient-text">Comparison</span>
          </h3>
          <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-4 text-muted-foreground font-medium">Feature</th>
                    <th className="text-center p-4 text-muted-foreground font-medium">🔬 Researcher</th>
                    <th className="text-center p-4 font-medium text-primary">💼 Professional</th>
                    <th className="text-center p-4 text-muted-foreground font-medium">🏢 Agency</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, i) => (
                    <tr key={row.name} className={i < featureComparison.length - 1 ? "border-b border-border/20" : ""}>
                      <td className="p-4 text-foreground/80">{row.name}</td>
                      {(["researcher", "professional", "agency"] as const).map((tier) => {
                        const val = row[tier];
                        return (
                          <td key={tier} className="p-4 text-center">
                            {typeof val === "boolean" ? (
                              val ? (
                                <Check className={`h-4 w-4 mx-auto ${tier === "professional" ? "text-primary" : "text-muted-foreground"}`} />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )
                            ) : (
                              <span className={tier === "professional" ? "text-primary font-medium" : "text-foreground/70"}>
                                {val}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-muted-foreground">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="h-4 w-4" /> SSL Secured
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Lock className="h-4 w-4" /> PCI Compliant
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CreditCard className="h-4 w-4" /> Powered by Stripe
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
