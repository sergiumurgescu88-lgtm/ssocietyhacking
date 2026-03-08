import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import { ScrollText } from "lucide-react";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "authorized-testing", title: "2. Authorized Testing Only" },
  { id: "prohibited", title: "3. Prohibited Activities" },
  { id: "accounts", title: "4. User Accounts" },
  { id: "liability", title: "5. Limitation of Liability" },
  { id: "termination", title: "6. Account Termination" },
  { id: "changes", title: "7. Changes to Terms" },
  { id: "governing-law", title: "8. Governing Law" },
  { id: "contact", title: "9. Contact" },
];

const Terms = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <NetworkBackground />
      <Header />
      <main className="flex-1 relative z-10">
        <div className="container max-w-4xl py-16 px-4">
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ScrollText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
                <p className="text-sm text-muted-foreground">Last updated: March 8, 2026</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            {/* TOC */}
            <nav className="hidden lg:block sticky top-24 self-start space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Table of Contents</p>
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                  {s.title}
                </a>
              ))}
            </nav>

            {/* Content */}
            <article className="prose-legal space-y-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <section id="acceptance" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By accessing or using SSocietySafe ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the Platform. These terms constitute a legally binding agreement between you and SSocietySafe.
                </p>
              </section>

              <section id="authorized-testing" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Authorized Testing Only</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  SSocietySafe is designed exclusively for <strong className="text-foreground">authorized security testing</strong>. You must:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Obtain explicit written authorization before scanning any target</li>
                  <li>Provide valid proof of authorization (bug bounty program URL, written consent, or contract)</li>
                  <li>Only scan domains and endpoints covered by your authorization</li>
                  <li>Comply with the scope and rules of any bug bounty program</li>
                  <li>Stop testing immediately if authorization is revoked</li>
                </ul>
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium">
                    ⚠️ Unauthorized scanning is illegal under Romanian law (Legea 161/2003) and international regulations. Violations will be reported to authorities.
                  </p>
                </div>
              </section>

              <section id="prohibited" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Prohibited Activities</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">The following activities are strictly prohibited:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Scanning targets without proper authorization</li>
                  <li>Attempting to exploit discovered vulnerabilities</li>
                  <li>Performing denial-of-service (DoS/DDoS) attacks</li>
                  <li>Exfiltrating, modifying, or destroying data</li>
                  <li>Scanning government or military infrastructure without authorization</li>
                  <li>Using the platform for competitive intelligence or corporate espionage</li>
                  <li>Reselling scan results without permission</li>
                  <li>Circumventing rate limits or scan restrictions</li>
                  <li>Creating multiple accounts to bypass usage limits</li>
                </ul>
              </section>

              <section id="accounts" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">4. User Accounts</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. You agree to notify us immediately of any unauthorized access to your account. Each account is for individual use only unless you have a team/agency subscription.
                </p>
              </section>

              <section id="liability" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  SSocietySafe provides security scanning tools "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Any damages resulting from the use or inability to use the Platform</li>
                  <li>False positives or false negatives in scan results</li>
                  <li>Actions taken by users based on scan results</li>
                  <li>Service interruptions or data loss</li>
                  <li>Third-party claims arising from your use of the Platform</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.
                </p>
              </section>

              <section id="termination" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Account Termination</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  We reserve the right to suspend or terminate your account at any time if:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>You violate these Terms of Service</li>
                  <li>You engage in unauthorized or illegal scanning activities</li>
                  <li>We receive a valid abuse report related to your account</li>
                  <li>Your payment fails and remains unresolved for 30 days</li>
                  <li>Required by law enforcement or court order</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Upon termination, your data will be retained for 30 days before permanent deletion, unless required by law.
                </p>
              </section>

              <section id="changes" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to Terms</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may update these Terms at any time. Material changes will be communicated via email or in-app notification at least 30 days before they take effect. Continued use of the Platform after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section id="governing-law" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Governing Law</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of Romania. Any disputes shall be resolved in the competent courts of Bucharest, Romania, unless otherwise required by mandatory consumer protection laws of your jurisdiction.
                </p>
              </section>

              <section id="contact" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For questions about these Terms, contact us at{" "}
                  <a href="mailto:legal@ssocietysafe.com" className="text-primary hover:underline">legal@ssocietysafe.com</a>.
                </p>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
