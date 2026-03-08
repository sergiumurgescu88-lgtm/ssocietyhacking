import { ReactNode } from "react";

const AnimatedOutlet = ({ children }: { children: ReactNode }) => (
  <div className="animate-page-in">{children}</div>
);

export { AnimatedOutlet };
