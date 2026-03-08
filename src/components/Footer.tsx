import { Shield, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container py-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-7 h-7">
              <Shield className="h-5 w-5 text-primary" />
              <Wifi className="absolute h-2.5 w-2.5 text-secondary bottom-0 right-0" />
            </div>
            <span className="text-sm font-semibold">
              <span className="gradient-text">SSociety</span>
              <span className="text-foreground">Safe</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">
            © 2026 SSocietySafe. Ethical Security Research Platform.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/legal" className="text-xs text-muted-foreground hover:text-primary transition-colors">Legal</Link>
            <Link to="/abuse" className="text-xs text-muted-foreground hover:text-primary transition-colors">Report Abuse</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
