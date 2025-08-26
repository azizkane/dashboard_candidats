import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppShell from '@/components/common/AppShell';
import {
  fetchCandidatesByElection,
  checkUserVoteStatus,
  fetchCandidatureDetails,
  voteForCandidate,
  getProgramDownloadUrl,
  getCandidatePhotoUrl
} from '../api';

const CandidatsParElection = () => {
  const { id: electionId } = useParams();
  const [candidats, setCandidats] = useState([]);
  const [detailsVisibles, setDetailsVisibles] = useState<number | null>(null);
  const [candidatureDetails, setCandidatureDetails] = useState<Record<number, any>>({});
  const [aDejaVote, setADejaVote] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCandidats();
      await verifierSiDejaVote();
    };

    fetchData();
  }, [electionId]);

  const fetchCandidats = async () => {
    try {
      const data = await fetchCandidatesByElection(electionId as string);
      setCandidats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des candidats', err);
    }
  };

  const verifierSiDejaVote = async () => {
    try {
      const hasVoted = await checkUserVoteStatus(electionId as string);
      setADejaVote(hasVoted);
    } catch (err) {
      console.error('Erreur lors de la vérification du vote', err);
    }
  };

  const fetchCandidatureDetailsData = async (candidatId: number) => {
    try {
      const details = await fetchCandidatureDetails(electionId as string, candidatId);
      setCandidatureDetails(prev => ({ ...prev, [candidatId]: details }));
    } catch (error) {
      console.error("Erreur lors du chargement de la candidature", error);
    }
  };

  const toggleDetails = async (candidatId: number) => {
    if (detailsVisibles === candidatId) {
      setDetailsVisibles(null);
    } else {
      await fetchCandidatureDetailsData(candidatId);
      setDetailsVisibles(candidatId);
    }
  };

  const voterPourCandidat = async (candidatId: number) => {
    const confirm = await Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous voter pour ce candidat ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    if (confirm.isConfirmed) {
      try {
        await voteForCandidate(candidatId, electionId as string);
        Swal.fire('Vote enregistré !', '', 'success');
        setADejaVote(true);
      } catch (error: any) {
        const message = error.message || 'Impossible de voter.';
        Swal.fire('Erreur', message, 'error');
      }
    }
  };

  const handleTelechargementProgramme = (programmePath: string) => {
    const url = getProgramDownloadUrl(programmePath);
    window.open(url, '_blank');
  };

  return (
    <div className="candidats-page">
      <AppShell role="electeur" title="Liste des candidats">
        <div className="p-4 md:p-6 space-y-4">
          {aDejaVote && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 text-blue-800 px-4 py-3">
              Vous avez déjà voté pour cette élection.
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Candidats à cette élection</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(candidats) && candidats.map((candidat: any) => {
              const details = candidatureDetails[candidat.id];

              return (
                <div
                  className="bg-white p-5 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition text-center"
                  key={candidat.id}
                >
                  <img
                    src={getCandidatePhotoUrl(candidat.profil)}
                    alt={candidat.nom}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                  />
                  <h3 className="font-semibold text-foreground">{candidat.prenom} {candidat.nom}</h3>
                  <p className="text-sm text-muted-foreground">{candidat.email}</p>

                  {detailsVisibles === candidat.id && details && (
                    <div className="mt-2 text-left text-sm">
                      <p><strong>Slogan :</strong> {details.slogan || 'Non renseigné'}</p>
                      {details.programme && (
                        <button
                          className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#07beb8] text-[#040f0f] font-semibold hover:opacity-90"
                          onClick={() => handleTelechargementProgramme(details.programme)}
                        >
                          Télécharger le programme
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 justify-center mt-3">
                    {!aDejaVote ? (
                      <button
                        onClick={() => voterPourCandidat(candidat.id)}
                        className="px-4 py-2 rounded-full bg-[#275dad] text-white font-semibold hover:bg-[#1f4c8d]"
                      >
                        Voter
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-full border border-blue-300 bg-blue-50 text-blue-800 text-sm font-semibold">
                        Vote enregistré
                      </span>
                    )}
                    <button
                      onClick={() => toggleDetails(candidat.id)}
                      className="px-4 py-2 rounded-full border border-blue-300 hover:bg-blue-50"
                    >
                      {detailsVisibles === candidat.id ? 'Masquer' : 'Voir plus'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AppShell>
    </div>
  );
};

export default CandidatsParElection;