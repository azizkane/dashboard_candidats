import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import VoterPageCandidat from "./pages/VoteCandidatPage";
import CandidatePage from "./pages/CandidatePage"; 
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";
import LoginElecteur from "@/pages/login-electeur";
import LoginCandidat from "@/pages/login-candidat";
import Register from '@/pages/register';
import DashboardElecteur from "./pages/DashboardElecteur";
import DashboardCandidat from "./pages/DashboardCandidat.tsx";
import MonProfilElecteur from "./pages/MonProfilElecteur";
import MonProfilCandidat from "./pages/MonProfilCandidat.tsx";
import DepotCandidature from "./pages/DepotCandidature.tsx";
import Election from "./pages/election.tsx";
import ElectionCandidat from "./pages/ElectionCandidat.tsx";
import CandidatsParElection from "./pages/CandidatsParElection.tsx";
import Resultat from "./pages/Resultat.tsx";
import ResultatCandidat from "./pages/ResultatCandidat.tsx";
import PvElecteur from "./pages/PvElecteur.tsx";
import PvCandidat from "./pages/PvCandidat.tsx";
import ResultatParElection from "./pages/ResultatsParElection.tsx";
import MaCandidature from "./pages/MaCandidature.tsx";
import ModifierCandidature from "./pages/ModifierCandidature.tsx";



const queryClient = new QueryClient();

function getAuthToken(): string | null {
  const tryKeys = ["token", "auth_token", "access_token"];
  for (const k of tryKeys) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v) return v;
  }
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) return user.token;
  } catch {}
  return null;
}

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = getAuthToken();
  if (!token) return <Navigate to="/" replace />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/candidate" element={<CandidatePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/login-electeur" element={<LoginElecteur />} />
          <Route path="/login-candidat" element={<LoginCandidat />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashbord-electeur" element={<RequireAuth><DashboardElecteur /></RequireAuth>} />
          <Route path="/electeur/profil" element={<RequireAuth><MonProfilElecteur /></RequireAuth>} />
          <Route path="/electeur/candidature" element={<RequireAuth><DepotCandidature /></RequireAuth>} />
          <Route path="/electeur/elections" element={<RequireAuth><Election /></RequireAuth>} />
          <Route path="/election/:id/candidats" element={<RequireAuth><CandidatsParElection /></RequireAuth>} />
          {/* Deprecated deep results route removed: use /electeur/resultats */}
          <Route path="/electeur/resultats" element={<RequireAuth><Resultat/></RequireAuth>} />
          <Route path="/electeur/pv" element={<RequireAuth><PvElecteur/></RequireAuth>} />
          
          {/* CANDIDAT */}
          <Route path="/dashbord-candidat" element={<RequireAuth><DashboardCandidat /></RequireAuth>} />
          <Route path="/candidat/ma_candidature" element={<RequireAuth><MaCandidature/></RequireAuth>} />
          <Route path="/candidat/profil" element={<RequireAuth><MonProfilCandidat /></RequireAuth>} />
          <Route path="/candidat/elections" element={<RequireAuth><ElectionCandidat /></RequireAuth>} />
          <Route path="/election/:id/candidats" element={<RequireAuth><CandidatsParElection /></RequireAuth>} />
          <Route path="/candidat/resultats" element={<RequireAuth><ResultatCandidat/></RequireAuth>} />
          <Route path="/candidat/pv" element={<RequireAuth><PvCandidat/></RequireAuth>} />
          {/* Deprecated deep results route removed: use /candidat/resultats */}
          <Route path="/candidat/modifier-candidature/:id" element={<RequireAuth><ModifierCandidature /></RequireAuth>} />


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
