import { AlertTriangle } from "lucide-react";

const LegalBanner = () => {
  return (
    <div className="sticky top-0 z-[60] bg-destructive/10 border-b border-destructive/20 backdrop-blur-xl">
      <div className="container flex items-center justify-center gap-2 py-2 px-4">
        <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
        <p className="text-xs font-medium text-destructive">
          Authorized testing only <span className="text-destructive/60 mx-1.5">|</span> All activities logged
        </p>
      </div>
    </div>
  );
};

export default LegalBanner;
