import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalBanner from "@/components/LegalBanner";
import Pricing from "@/components/Pricing";
import NetworkBackground from "@/components/NetworkBackground";

const PricingPage = () => (
  <div className="min-h-screen flex flex-col bg-background relative">
    <NetworkBackground />
    <LegalBanner />
    <Header />
    <main className="flex-1">
      <Pricing />
    </main>
    <Footer />
  </div>
);

export default PricingPage;
