import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/common/AppShell';
import {
  fetchElectionsList,
  getElectionImageUrl,
  fetchCandidatesByElection,
  fetchVotesForCandidate
} from '../api';

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
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [loadingElections, setLoadingElections] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');
  
  // États pour les résultats
  const [candidats, setCandidats] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  
  const navigate = useNavigate();

  // Fonction pour charger les résultats d'une élection
  const loadElectionResults = async (electionId: number) => {
    try {
      setLoadingResults(true);
      const candidatsData = await fetchCandidatesByElection(electionId.toString());
      
      // Récupérer les votes pour chaque candidat
      const candidatsAvecVotes = await Promise.all(
        candidatsData.map(async (candidat: any) => {
          try {
            const votes = await fetchVotesForCandidate(electionId, candidat.id);
            return { ...candidat, votes_count: votes };
          } catch (error) {
            console.error(`Erreur lors du chargement des votes pour ${candidat.id}:`, error);
            return { ...candidat, votes_count: 0 };
          }
        })
      );
      
      setCandidats(candidatsAvecVotes);
      
      // Calculer le total des votes
      const total = candidatsAvecVotes.reduce((sum: number, candidat: any) => sum + (candidat.votes_count || 0), 0);
      setTotalVotes(total);
    } catch (error) {
      console.error("Erreur lors du chargement des résultats:", error);
    } finally {
      setLoadingResults(false);
    }
  };

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
      <AppShell role="electeur" title="Résultats par Élection">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Résultats par Élection</h1>
            </div>

            {errMsg && <div className="text-center text-red-600 font-medium mb-4">{errMsg}</div>}

            {loadingElections ? (
              <div className="text-center text-gray-600">Chargement des élections...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {elections.map((election) => (
                  <div
                    key={election.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition cursor-pointer"
                    onClick={async () => {
                      setSelectedElection(election);
                      await loadElectionResults(election.id);
                    }}
                  >
                    <img
                      src={getElectionImageUrl(election.image || '')}
                      alt={election.titre}
                      className="w-full h-32 object-cover rounded-xl mb-3"
                    />
                    <h3 className="font-semibold text-foreground">{election.titre}</h3>
                    <p className="text-sm text-muted-foreground">{election.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Début : {election.date_debut} • Fin : {election.date_fin}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        {selectedElection && (
          <div
            className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedElection(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-xl border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="text-lg font-semibold text-foreground">
                  {`Résultats — Élection #${selectedElection.id}`}
                </h3>
                <button
                  aria-label="Fermer"
                  className="text-gray-500 hover:text-gray-800 text-xl leading-none"
                  onClick={() => setSelectedElection(null)}
                >
                  ×
                </button>
              </div>
              <div className="px-5 py-6">
                {loadingResults ? (
                  <div className="text-center text-gray-600">Chargement des résultats...</div>
                ) : candidats.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">
                        Total des votes : <span className="font-semibold text-foreground">{totalVotes}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {candidats
                        .sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
                        .map((candidat, index) => (
                          <div key={candidat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                              <div>
                                <p className="font-medium text-foreground">
                                  {candidat.prenom} {candidat.nom}
                                </p>
                                <p className="text-sm text-muted-foreground">{candidat.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                {candidat.votes_count || 0} vote{(candidat.votes_count || 0) > 1 ? 's' : ''}
                              </p>
                              {totalVotes > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  {Math.round(((candidat.votes_count || 0) / totalVotes) * 100)}%
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    Aucun candidat trouvé pour cette élection.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </>
  );
};

export default ResultatsElecteur;
