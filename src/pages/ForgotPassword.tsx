import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Reset link sent! Check your email.");
    }
  };

  return (
    <AuthLayout>
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-sm text-muted-foreground mb-6">We've sent a password reset link to <span className="text-foreground font-medium">{email}</span></p>
          <Link to="/login" className="text-sm text-primary hover:underline font-medium">Back to Sign In</Link>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a reset link</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 h-10" required />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full glow-button bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold h-11 rounded-xl">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-6 transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to Sign In
          </Link>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
