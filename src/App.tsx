import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ExplorePage from "./pages/ExplorePage";
import { EXTRA_PAGES } from "./config/extraPages";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CasePage from "./pages/CasePage";
import KidsPage from "./pages/KidsPage";
import TreatmentsPage from "./pages/TreatmentsPage";
import InfographicsPage from "./pages/InfographicsPage";
import NewsPage from "./pages/NewsPage";
import { ServicesIndexPage, ServiceDetailPage } from "./pages/ServicePages";
import { SocialIndexPage, SocialDetailPage } from "./pages/SocialPages";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import OAuthConsent from "./pages/OAuthConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ar" element={<Index />} />
              <Route path="/ku" element={<Index />} />
              {["", "/ar", "/ku"].map((p) => [
                <Route key={`${p}/case`} path={`${p}/case`} element={<CasePage />} />,
                <Route key={`${p}/kids`} path={`${p}/kids`} element={<KidsPage />} />,
                <Route key={`${p}/treatments`} path={`${p}/treatments`} element={<TreatmentsPage />} />,
                <Route key={`${p}/news`} path={`${p}/news`} element={<NewsPage />} />,
                <Route key={`${p}/services`} path={`${p}/services`} element={<ServicesIndexPage />} />,
                <Route key={`${p}/services/:slug`} path={`${p}/services/:slug`} element={<ServiceDetailPage />} />,
                <Route key={`${p}/social`} path={`${p}/social`} element={<SocialIndexPage />} />,
                <Route key={`${p}/social/:slug`} path={`${p}/social/:slug`} element={<SocialDetailPage />} />,
                <Route key={`${p}/infographics`} path={`${p}/infographics`} element={<InfographicsPage />} />,
              ])}
              {EXTRA_PAGES.flatMap(page=>["", "/ar", "/ku"].map(prefix=><Route key={prefix+page.path} path={prefix+page.path} element={<ExplorePage />} />))}
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;