import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { PageLoader } from "./components/PageLoader";
import { AnimatedOutlet } from "./components/AnimatedOutlet";

// Lazy load all pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Authorization = lazy(() => import("./pages/Authorization"));
const ApiDiscovery = lazy(() => import("./pages/ApiDiscovery"));
const VulnerabilityScanner = lazy(() => import("./pages/VulnerabilityScanner"));
const Reports = lazy(() => import("./pages/Reports"));
const Remediation = lazy(() => import("./pages/Remediation"));
const Settings = lazy(() => import("./pages/Settings"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Legal = lazy(() => import("./pages/Legal"));
const Abuse = lazy(() => import("./pages/Abuse"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const SuspenseWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth pages — no header/footer */}
            <Route path="/login" element={<SuspenseWrap><Login /></SuspenseWrap>} />
            <Route path="/signup" element={<SuspenseWrap><Signup /></SuspenseWrap>} />
            <Route path="/forgot-password" element={<SuspenseWrap><ForgotPassword /></SuspenseWrap>} />
            <Route path="/reset-password" element={<SuspenseWrap><ResetPassword /></SuspenseWrap>} />
            <Route path="/dashboard/*" element={<SuspenseWrap><Dashboard /></SuspenseWrap>} />
            <Route path="/dashboard/authorization" element={<SuspenseWrap><Authorization /></SuspenseWrap>} />
            <Route path="/dashboard/api-scanner" element={<SuspenseWrap><ApiDiscovery /></SuspenseWrap>} />
            <Route path="/dashboard/vulnerability" element={<SuspenseWrap><VulnerabilityScanner /></SuspenseWrap>} />
            <Route path="/dashboard/reports" element={<SuspenseWrap><Reports /></SuspenseWrap>} />
            <Route path="/dashboard/remediation" element={<SuspenseWrap><Remediation /></SuspenseWrap>} />
            <Route path="/dashboard/settings" element={<SuspenseWrap><Settings /></SuspenseWrap>} />

            {/* Main layout */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex flex-col">
                  
                  <Header />
                  <main className="flex-1 flex flex-col">
                    <Routes>
                      <Route path="/" element={<SuspenseWrap><AnimatedOutlet><Index /></AnimatedOutlet></SuspenseWrap>} />
                      <Route path="/pricing" element={<SuspenseWrap><AnimatedOutlet><PricingPage /></AnimatedOutlet></SuspenseWrap>} />
                      <Route path="/terms" element={<SuspenseWrap><AnimatedOutlet><Terms /></AnimatedOutlet></SuspenseWrap>} />
                      <Route path="/privacy" element={<SuspenseWrap><AnimatedOutlet><Privacy /></AnimatedOutlet></SuspenseWrap>} />
                      <Route path="/legal" element={<SuspenseWrap><AnimatedOutlet><Legal /></AnimatedOutlet></SuspenseWrap>} />
                      <Route path="/abuse" element={<SuspenseWrap><AnimatedOutlet><Abuse /></AnimatedOutlet></SuspenseWrap>} />
                      <Route path="*" element={<SuspenseWrap><NotFound /></SuspenseWrap>} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
