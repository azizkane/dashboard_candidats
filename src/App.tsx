import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/dashbord-electeur" element={<DashboardElecteur />} />
          <Route path="/electeur/profil" element={<MonProfilElecteur />} />
          <Route path="/electeur/candidature" element={<DepotCandidature />} />
          <Route path="/electeur/elections" element={<Election />} />
          <Route path="/election/:id/candidats" element={<CandidatsParElection />} />
          <Route path="/resultat/:id/candidats" element={<ResultatParElection />} />
          <Route path="/electeur/resultats" element={<Resultat/>} />
          <Route path="/electeur/pv" element={<PvElecteur/>} />
          
          {/* CANDIDAT */}
          <Route path="/dashbord-candidat" element={<DashboardCandidat />} />
          <Route path="/candidat/ma_candidature" element={<MaCandidature/>} />
          <Route path="/candidat/profil" element={<MonProfilCandidat />} />
          <Route path="/candidat/elections" element={<ElectionCandidat />} />
          <Route path="/election/:id/candidats" element={<CandidatsParElection />} />
          <Route path="/candidat/resultats" element={<ResultatCandidat/>} />
          <Route path="/candidat/pv" element={<PvCandidat/>} />
          <Route path="candidat/resultat/:id/candidats" element={<ResultatParElection />} />
          <Route path="/candidat/modifier-candidature/:id" element={<ModifierCandidature />} />


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
