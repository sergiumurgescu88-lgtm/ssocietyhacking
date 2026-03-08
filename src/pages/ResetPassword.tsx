import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      toast.error("Invalid or expired reset link.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/login");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-1">New Password</h2>
      <p className="text-sm text-muted-foreground mb-6">Enter your new password</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">New Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 h-10" required />
          </div>
        </div>

        <div>
          <Label htmlFor="confirm" className="text-xs font-medium text-muted-foreground">Confirm Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-10 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 h-10" required />
          </div>
          {confirm && password !== confirm && (
            <p className="text-[10px] text-destructive mt-1">Passwords don't match</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full glow-button bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold h-11 rounded-xl">
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
