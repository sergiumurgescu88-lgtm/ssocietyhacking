import { useEffect } from "react";
import NetworkBackground from "@/components/NetworkBackground";
import { Shield } from "lucide-react";

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "data-collection", title: "2. Data We Collect" },
  { id: "data-use", title: "3. How We Use Data" },
  { id: "data-retention", title: "4. Data Retention" },
  { id: "your-rights", title: "5. Your Rights (GDPR)" },
  { id: "cookies", title: "6. Cookies" },
  { id: "third-parties", title: "7. Third-Party Services" },
  { id: "security", title: "8. Data Security" },
  { id: "children", title: "9. Children's Privacy" },
  { id: "dpo", title: "10. Contact DPO" },
];

const Privacy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="relative">
      <NetworkBackground />
      <div className="relative z-10 container max-w-4xl py-16 px-4">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">Last updated: March 8, 2026 · GDPR Compliant</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          <nav className="hidden lg:block sticky top-24 self-start space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Table of Contents</p>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                {s.title}
              </a>
            ))}
          </nav>

          <article className="space-y-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <section id="overview" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Overview</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SSocietySafe ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data in compliance with the General Data Protection Regulation (GDPR) and Romanian data protection laws.
              </p>
            </section>

            <section id="data-collection" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Data We Collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">We collect the following categories of data:</p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Account Information</h3>
                  <p className="text-sm text-muted-foreground">Full name, email address, password (hashed), profile picture</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Scan Data</h3>
                  <p className="text-sm text-muted-foreground">Target domains, scan configurations, vulnerability results, remediation status</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Usage Data</h3>
                  <p className="text-sm text-muted-foreground">IP addresses, browser type, pages visited, timestamps, session duration</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Payment Data</h3>
                  <p className="text-sm text-muted-foreground">Processed securely by Stripe. We do not store credit card numbers.</p>
                </div>
              </div>
            </section>

            <section id="data-use" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Data</h2>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Providing and improving our security scanning services</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Sending service notifications and security alerts</li>
                <li>Preventing abuse and unauthorized access</li>
                <li>Complying with legal obligations</li>
                <li>Generating anonymized usage statistics</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                <strong className="text-foreground">Legal basis:</strong> Contract performance (Art. 6(1)(b) GDPR), legitimate interest (Art. 6(1)(f) GDPR), and consent where applicable (Art. 6(1)(a) GDPR).
              </p>
            </section>

            <section id="data-retention" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Retention</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-2 text-muted-foreground font-medium">Data Type</th>
                      <th className="text-left p-2 text-muted-foreground font-medium">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/20"><td className="p-2 text-foreground/80">Account data</td><td className="p-2 text-muted-foreground">Until account deletion + 30 days</td></tr>
                    <tr className="border-b border-border/20"><td className="p-2 text-foreground/80">Scan results</td><td className="p-2 text-muted-foreground">2 years from creation</td></tr>
                    <tr className="border-b border-border/20"><td className="p-2 text-foreground/80">Reports</td><td className="p-2 text-muted-foreground">2 years from creation</td></tr>
                    <tr className="border-b border-border/20"><td className="p-2 text-foreground/80">Activity logs</td><td className="p-2 text-muted-foreground">2 years</td></tr>
                    <tr className="border-b border-border/20"><td className="p-2 text-foreground/80">Payment records</td><td className="p-2 text-muted-foreground">7 years (legal requirement)</td></tr>
                    <tr><td className="p-2 text-foreground/80">Analytics data</td><td className="p-2 text-muted-foreground">12 months (anonymized)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="your-rights" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights (GDPR)</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">Under the GDPR, you have the following rights:</p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong className="text-foreground">Right of Access</strong> — Request a copy of all personal data we hold about you</li>
                <li><strong className="text-foreground">Right to Rectification</strong> — Correct inaccurate or incomplete data</li>
                <li><strong className="text-foreground">Right to Erasure</strong> — Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong className="text-foreground">Right to Data Portability</strong> — Export your data in a machine-readable format (JSON/CSV)</li>
                <li><strong className="text-foreground">Right to Restrict Processing</strong> — Limit how we process your data</li>
                <li><strong className="text-foreground">Right to Object</strong> — Object to processing based on legitimate interest</li>
                <li><strong className="text-foreground">Right to Withdraw Consent</strong> — Withdraw consent at any time for consent-based processing</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                To exercise any of these rights, contact our DPO at{" "}
                <a href="mailto:dpo@ssocietysafe.com" className="text-primary hover:underline">dpo@ssocietysafe.com</a>.
                We will respond within 30 days.
              </p>
            </section>

            <section id="cookies" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use essential cookies for authentication and session management. We do not use third-party tracking cookies. Analytics cookies are only used with your explicit consent and are anonymized.
              </p>
            </section>

            <section id="third-parties" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Third-Party Services</h2>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong className="text-foreground">Stripe</strong> — Payment processing (PCI DSS compliant)</li>
                <li><strong className="text-foreground">Cloud Infrastructure</strong> — Authentication and database (EU data centers)</li>
                <li><strong className="text-foreground">SecurityTrails / Shodan / Censys</strong> — External scan data (only when user-configured)</li>
              </ul>
            </section>

            <section id="security" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Data Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We implement industry-standard security measures: encryption at rest and in transit (TLS 1.3), access controls, regular security audits, and incident response procedures. In the event of a data breach, affected users and the relevant supervisory authority will be notified within 72 hours as required by GDPR.
              </p>
            </section>

            <section id="children" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SSocietySafe is not intended for use by individuals under 18 years of age. We do not knowingly collect personal data from minors.
              </p>
            </section>

            <section id="dpo" className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Data Protection Officer</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Data Protection Officer</strong></p>
                <p>Email: <a href="mailto:dpo@ssocietysafe.com" className="text-primary hover:underline">dpo@ssocietysafe.com</a></p>
                <p>Address: Bucharest, Romania</p>
                <p className="mt-2">You also have the right to lodge a complaint with the Romanian National Supervisory Authority for Personal Data Processing (ANSPDCP).</p>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
