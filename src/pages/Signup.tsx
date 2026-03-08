import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const getStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: Record<number, { label: string; color: string }> = {
    0: { label: "Very Weak", color: "bg-destructive" },
    1: { label: "Weak", color: "bg-destructive" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Strong", color: "bg-primary" },
    4: { label: "Very Strong", color: "bg-primary" },
  };
  return { score, ...map[score] };
};

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [age, setAge] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms || !age) {
      toast.error("Please accept the terms and confirm your age.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to confirm your account!");
      navigate("/login");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-1">Create Account</h2>
      <p className="text-sm text-muted-foreground mb-6">Join the ethical security community</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Full Name</Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 h-10" required />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 h-10" required />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 h-10" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength.score ? strength.color : "bg-border/50"}`} />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">{strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="confirm" className="text-xs font-medium text-muted-foreground">Confirm Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20 h-10" required />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[10px] text-destructive mt-1">Passwords don't match</p>
          )}
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-2">
            <Checkbox id="terms" checked={terms} onCheckedChange={(c) => setTerms(!!c)} className="mt-0.5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="age" checked={age} onCheckedChange={(c) => setAge(!!c)} className="mt-0.5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <Label htmlFor="age" className="text-xs text-muted-foreground cursor-pointer">I confirm I am 18 years or older</Label>
          </div>
        </div>

        <Button type="submit" disabled={loading || !terms || !age} className="w-full glow-button bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold h-11 rounded-xl">
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
