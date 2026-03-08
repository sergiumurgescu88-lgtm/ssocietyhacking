import { Shield, Wifi } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container py-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-7 h-7">
              <Shield className="h-5 w-5 text-primary" />
              <Wifi className="absolute h-2.5 w-2.5 text-secondary bottom-0 right-0" />
            </div>
            <span className="text-sm font-semibold">
              <span className="gradient-text">SSociety</span>
              <span className="text-foreground">Safe</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 SSocietySafe. Ethical Security Research Platform.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
