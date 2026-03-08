import Pricing from "@/components/Pricing";
import NetworkBackground from "@/components/NetworkBackground";

const PricingPage = () => (
  <div className="relative">
    <NetworkBackground />
    <div className="relative z-10">
      <Pricing />
    </div>
  </div>
);

export default PricingPage;
