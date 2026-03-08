import { useEffect, useState } from "react";
import NetworkBackground from "@/components/NetworkBackground";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Send, Clock, Shield, Loader2 } from "lucide-react";

const Abuse = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    targetDomain: "",
    description: "",
    evidence: "",
    anonymous: false,
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.targetDomain || !form.description) {
      toast({ title: "Required fields", description: "Please fill in the target domain and description.", variant: "destructive" });
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast({ title: "Report submitted", description: "We will investigate and respond within 24 hours." });
    setForm({ name: "", email: "", targetDomain: "", description: "", evidence: "", anonymous: false });
  };

  return (
    <div className="relative">
      <NetworkBackground />
      <div className="relative z-10 container max-w-3xl py-16 px-4">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Report Abuse</h1>
              <p className="text-sm text-muted-foreground">Last updated: March 8, 2026</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-border/50 text-center">
              <Send className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Email</p>
              <a href="mailto:abuse@ssocietysafe.com" className="text-xs text-primary hover:underline">abuse@ssocietysafe.com</a>
            </div>
            <div className="glass-card p-4 rounded-xl border border-border/50 text-center">
              <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Response Time</p>
              <p className="text-xs text-muted-foreground">Within 24 hours</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-border/50 text-center">
              <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Anonymous</p>
              <p className="text-xs text-muted-foreground">Reports accepted</p>
            </div>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">When to Report</CardTitle>
              <CardDescription>Submit a report if you believe SSocietySafe is being used for unauthorized or malicious activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Someone is scanning your infrastructure without authorization</li>
                <li>A user is exploiting vulnerabilities discovered through the platform</li>
                <li>Scans are causing disruption to your services</li>
                <li>A user has uploaded fraudulent authorization documents</li>
                <li>Any other misuse of the platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Abuse Report Form</CardTitle>
              <CardDescription>All fields marked with * are required</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id="anonymous"
                    checked={form.anonymous}
                    onCheckedChange={(c) => setForm((f) => ({ ...f, anonymous: !!c, name: !!c ? "" : f.name, email: !!c ? "" : f.email }))}
                  />
                  <Label htmlFor="anonymous" className="text-sm cursor-pointer">Submit anonymously</Label>
                </div>

                {!form.anonymous && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Your Name</Label>
                      <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Your Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Target Domain / IP *</Label>
                  <Input
                    value={form.targetDomain}
                    onChange={(e) => setForm((f) => ({ ...f, targetDomain: e.target.value }))}
                    placeholder="example.com or 192.168.1.1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description of Abuse *</Label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the unauthorized activity in detail..."
                    required
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Evidence (URLs, logs, screenshots)</Label>
                  <textarea
                    value={form.evidence}
                    onChange={(e) => setForm((f) => ({ ...f, evidence: e.target.value }))}
                    placeholder="Paste any relevant evidence here..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">What Happens Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Report Received", desc: "Your report is logged and assigned to our security team" },
                  { step: "2", title: "Investigation (24h)", desc: "We review the evidence and investigate the reported activity" },
                  { step: "3", title: "Action Taken", desc: "Offending accounts are suspended and evidence preserved" },
                  { step: "4", title: "Notification", desc: "You receive a follow-up (if contact info provided) within 48 hours" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{s.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Abuse;
