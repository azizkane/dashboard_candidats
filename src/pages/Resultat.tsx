import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarElecteur from '@/components/SidebarElecteur';
import AppBar from '@/components/AppbarElecteur';
import FooterElecteur from '@/components/FooterElecteur';
import {
  fetchElectionsList,
  getElectionImageUrl
} from '../api'; // Assuming getElectionImageUrl is also in api.ts

interface Election {
  id: number;
  titre: string;
  description?: string;
  image?: string;
  date_debut?: string;
  date_fin?: string;
}

const ResultatsElecteur: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loadingElections, setLoadingElections] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const getElections = async () => {
      try {
        setLoadingElections(true);
        const data: Election[] = await fetchElectionsList();
        setElections(data);
      } catch (error) {
        console.error("Erreur lors du chargement des élections:", error);
        setErrMsg("Erreur lors du chargement des élections.");
      } finally {
        setLoadingElections(false);
      }
    };
    getElections();
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarElecteur />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-gray-100">
          <AppBar title="Espace Électeur" />

          <div className="flex-grow p-6 mt-16 max-w-7xl mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">Résultats par Élection</h1>

            {errMsg && <div className="text-center text-red-600 font-medium mb-4">{errMsg}</div>}

            {loadingElections ? (
              <div className="text-center text-gray-600">Chargement des élections...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {elections.map((election) => (
                  <div
                    key={election.id}
                    onClick={() => navigate(`/resultat/${election.id}/candidats`)}
                    className="cursor-pointer border-2 rounded-xl overflow-hidden shadow-sm transition transform hover:scale-105 border-gray-200"
                  >
                    <img
                      src={getElectionImageUrl(election.image || '')}
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
                        Cliquer pour voir les résultats
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterElecteur />
    </>
  );
};

export default ResultatsElecteur;
