import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import { Button } from "@/components/ui/button";
import { Scale, Download } from "lucide-react";

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "romanian-law", title: "2. Romanian Law" },
  { id: "international", title: "3. International Regulations" },
  { id: "when-legal", title: "4. When Scanning is Legal" },
  { id: "authorization", title: "5. Authorization Requirements" },
  { id: "templates", title: "6. Authorization Templates" },
];

const Legal = () => {
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
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Legal Framework</h1>
                <p className="text-sm text-muted-foreground">Last updated: March 8, 2026</p>
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
                  Security testing operates within a complex legal landscape. This page provides guidance on the legal framework applicable to using SSocietySafe. It is not legal advice — consult a qualified attorney for specific situations.
                </p>
              </section>

              <section id="romanian-law" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Romanian Law (Legea 161/2003)</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Romania's primary cybercrime legislation is <strong className="text-foreground">Legea 161/2003</strong> (Titlul III — Prevenirea și combaterea criminalității informatice), which implements the Budapest Convention on Cybercrime.
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">Art. 42 — Unauthorized Access</p>
                    <p className="text-xs text-muted-foreground mt-1">Accessing a computer system without authorization is punishable by 2–7 years imprisonment.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">Art. 43 — Data Interception</p>
                    <p className="text-xs text-muted-foreground mt-1">Unauthorized interception of data transmissions is punishable by 1–5 years imprisonment.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">Art. 44 — Data Integrity</p>
                    <p className="text-xs text-muted-foreground mt-1">Altering, deleting, or damaging electronic data without authorization is punishable by 2–7 years.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">Art. 46 — Unauthorized Operations</p>
                    <p className="text-xs text-muted-foreground mt-1">Performing unauthorized operations that alter the functioning of a computer system is punishable by 3–12 years.</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary font-medium">
                    ✅ Authorized testing with written consent is NOT considered a criminal offense under Romanian law.
                  </p>
                </div>
              </section>

              <section id="international" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">3. International Regulations</h2>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">🇪🇺 EU — NIS2 Directive</p>
                    <p className="text-xs text-muted-foreground mt-1">Mandates cybersecurity risk assessments for essential and important entities. Security testing is a recognized compliance measure.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">🇺🇸 US — CFAA (Computer Fraud and Abuse Act)</p>
                    <p className="text-xs text-muted-foreground mt-1">Unauthorized access is a federal crime. Authorization must be explicit and documented.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">🇬🇧 UK — Computer Misuse Act 1990</p>
                    <p className="text-xs text-muted-foreground mt-1">Similar to CFAA. Authorized penetration testing is exempt when properly documented.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium text-foreground">🌐 Budapest Convention</p>
                    <p className="text-xs text-muted-foreground mt-1">International treaty on cybercrime signed by 60+ countries. Provides framework for authorized security research.</p>
                  </div>
                </div>
              </section>

              <section id="when-legal" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">4. When Scanning is Legal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-2">✅ Legal Scanning</p>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                      <li>Bug bounty programs (HackerOne, Bugcrowd)</li>
                      <li>Written authorization from asset owner</li>
                      <li>Your own infrastructure</li>
                      <li>Contracted penetration testing</li>
                      <li>Compliance assessments (PCI DSS, SOC 2)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive mb-2">❌ Illegal Scanning</p>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                      <li>Without authorization of any kind</li>
                      <li>Outside the scope of authorization</li>
                      <li>After authorization expires or is revoked</li>
                      <li>Government systems without clearance</li>
                      <li>With intent to exploit or damage</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="authorization" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Authorization Requirements</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">Valid authorization must include:</p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Clear identification of the authorized tester</li>
                  <li>Specific scope (domains, IP ranges, endpoints)</li>
                  <li>Permitted testing methods and tools</li>
                  <li>Start and end dates</li>
                  <li>Signature of the asset owner or authorized representative</li>
                  <li>Emergency contact information</li>
                </ul>
              </section>

              <section id="templates" className="glass-card p-6 rounded-xl border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Authorization Templates</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Download our pre-made authorization templates to ensure your testing is properly documented:
                </p>
                <div className="space-y-3">
                  {[
                    { name: "Bug Bounty Authorization", desc: "For programs on HackerOne, Bugcrowd, etc." },
                    { name: "Penetration Test Agreement", desc: "Formal contract between tester and client" },
                    { name: "Internal Security Audit", desc: "For testing your own organization's assets" },
                    { name: "Third-Party Assessment", desc: "For authorized third-party security reviews" },
                  ].map((t) => (
                    <div key={t.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
