import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarCandidat from '@/components/SidebarCandidat';
import AppBar from '@/components/AppbarCandidat';
import FooterCandidat from '@/components/FooterCandidat';

interface Election {
  id: number;
  titre: string;
  description?: string;
  image?: string;
  date_debut?: string;
  date_fin?: string;
}

const API_BASE = 'http://localhost:8000';

const ResultatsCandidat: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loadingElections, setLoadingElections] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    (async () => {
      try {
        setLoadingElections(true);
        const res = await axios.get(`${API_BASE}/api/liste_elections`, { headers });
        const data: Election[] = res.data?.data || [];
        setElections(data);
      } catch {
        setErrMsg("Erreur lors du chargement des élections.");
      } finally {
        setLoadingElections(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarCandidat />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-gray-100">
          <AppBar title="Espace Candidat" />

          <div className="flex-grow p-6 mt-16 max-w-7xl mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">Résultats par Élection</h1>

            {errMsg && <div className="text-center text-red-600 font-medium mb-4">{errMsg}</div>}

            {loadingElections ? (
              <div className="text-center text-gray-600">Chargement des élections…</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {elections.map((election) => (
                  <div
                    key={election.id}
                    onClick={() => navigate(`/candidat/resultat/${election.id}/candidats`)}
                    className="cursor-pointer border-2 rounded-xl overflow-hidden shadow-sm transition transform hover:scale-105 border-gray-200"
                  >
                    <img
                      src={`${API_BASE}/storage/${election.image}`}
                      alt={election.titre}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{election.titre}</h3>
                      <p className="text-sm text-gray-500">{election.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Début : {election.date_debut} | Fin : {election.date_fin}
                      </p>
                      <p className="mt-2 text-sm text-blue-600 font-medium">
                        Cliquer pour voir les candidats
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterCandidat />
    </>
  );
};

export default ResultatsCandidat;
