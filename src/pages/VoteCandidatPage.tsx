import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarCandidat from '@/components/SidebarCandidat';
import AppBar from '@/components/AppbarCandidat';
import FooterCandidat from '@/components/FooterCandidat';
import { ToastContainer, toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import 'react-toastify/dist/ReactToastify.css';

interface Election {
  id: number;
  titre: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  profil?: string | null;
}

interface CurrentUser {
  id: number;
  nom?: string;
  prenom?: string;
  email: string;
}

const API_BASE = 'http://localhost:8000';

const VoteCandidat: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<number | null>(null);
  const [candidats, setCandidats] = useState<Candidate[]>([]);
  const [loadingElections, setLoadingElections] = useState<boolean>(false);
  const [loadingCandidats, setLoadingCandidats] = useState<boolean>(false);
  const [votingId, setVotingId] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchUserAndElections = async () => {
      try {
        setLoadingElections(true);
        const [meRes, electionsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/user`, { headers: authHeader }),
          axios.get(`${API_BASE}/api/liste_elections`, { headers: authHeader }),
        ]);
        setCurrentUser(meRes.data);
        const electionsData: Election[] = electionsRes.data?.data || electionsRes.data || [];
        setElections(electionsData);
      } catch (e) {
        toast.error("Erreur de chargement (utilisateur/élections).");
      } finally {
        setLoadingElections(false);
      }
    };
    fetchUserAndElections();
  }, []);

  const fetchCandidats = async (electionId: number) => {
    setSelectedElectionId(electionId);
    setCandidats([]);
    if (!electionId) return;

    try {
      setLoadingCandidats(true);
      const res = await axios.get(
        `${API_BASE}/api/candidats_par_election/${electionId}`,
        { headers: authHeader }
      );

      const list: Candidate[] = (res.data?.data || []).map((u: any) => ({
        id: u.id,
        name: u.name || `${u.nom ?? ''} ${u.prenom ?? ''}`.trim() || u.email,
        email: u.email,
        profil: u.profil ?? null,
      }));

      setCandidats(list);
    } catch {
      toast.error("Erreur lors du chargement des candidats.");
    } finally {
      setLoadingCandidats(false);
    }
  };

  const getProfilUrl = (profil?: string | null) => {
    if (!profil) return null;
    return `${API_BASE}/storage/${profil}`;
  };

  const handleVote = async (candidatId: number) => {
    if (!currentUser?.id || !selectedElectionId) {
      toast.warn("Sélectionnez une élection et assurez-vous d'être connecté.");
      return;
    }

    setVotingId(candidatId);
    try {
      const payload = {
        user_id: currentUser.id,
        election_id: selectedElectionId,
        candidat_id: candidatId,
        date_vote: new Date().toISOString().split('T')[0],
      };

      await axios.post(`${API_BASE}/api/voter`, payload, { headers: authHeader });
      toast.success("Votre vote a été enregistré !");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors du vote.";
      toast.error(msg);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      <SidebarCandidat />

      <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
        <AppBar title="Espace Candidat" />

        <div className="flex-grow p-6 mt-16 max-w-7xl mx-auto w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">
            {currentUser ? `Bienvenue, ${currentUser.nom ?? 'Candidat'}` : 'Bienvenue'}
          </h1>

          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <label className="block font-semibold mb-2 text-gray-700">Sélectionner une élection</label>
            <div className="max-w-md">
              <Dropdown
                value={selectedElectionId}
                options={elections}
                onChange={(e) => fetchCandidats(e.value)}
                optionLabel="titre"
                optionValue="id"
                placeholder={loadingElections ? 'Chargement...' : 'Choisir une élection'}
                className="w-full"
                disabled={loadingElections}
              />
            </div>
          </div>

          {!selectedElectionId && (
            <div className="text-gray-600">Sélectionnez une élection pour voir les candidats.</div>
          )}

          {selectedElectionId && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidats</h2>

              {loadingCandidats ? (
                <div className="text-gray-600">Chargement des candidats...</div>
              ) : candidats.length === 0 ? (
                <div className="text-gray-600">Aucun candidat trouvé pour cette élection.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {candidats.map((c) => {
                    const avatar = getProfilUrl(c.profil);
                    return (
                      <div
                        key={c.id}
                        className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col items-center text-center"
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-3">
                          {avatar ? (
                            <img src={avatar} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                          )}
                        </div>
                        <div className="font-semibold text-gray-800">{c.name}</div>
                        <div className="text-sm text-gray-500 mb-4">{c.email}</div>

                        <button
                          onClick={() => handleVote(c.id)}
                          disabled={votingId === c.id}
                          className={`w-full py-2 rounded-md font-semibold text-white ${
                            votingId === c.id ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {votingId === c.id ? 'Vote en cours...' : 'Voter'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <FooterCandidat />
      </div>
    </div>
  );
};

export default VoteCandidat;
