import { Shield, Wifi, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Legal", href: "/legal" },
];

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card border-border p-0">
              <div className="p-4 border-b border-border">
                <Logo />
              </div>
              <nav className="flex flex-col gap-1 p-3">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary bg-primary/10"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Nav links - desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link key={item.label} to={item.href}>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 text-sm">
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Button
              onClick={() => navigate("/dashboard")}
              className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold"
            >
              Dashboard
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-muted-foreground hover:text-foreground text-sm hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative flex items-center justify-center w-9 h-9">
      <Shield className="h-7 w-7 text-primary" />
      <Wifi className="absolute h-3 w-3 text-secondary bottom-0.5 right-0" />
    </div>
    <span className="text-lg font-bold tracking-tight">
      <span className="gradient-text">SSociety</span>
      <span className="text-foreground">Safe</span>
    </span>
  </div>
);

export default Header;
