import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Appbar from '../components/AppbarElecteur';
import SidebarElecteur from '../components/SidebarElecteur';
import FooterElecteur from '../components/FooterElecteur';

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
    const token = localStorage.getItem('auth_token');
    try {
      const res = await axios.get(`http://localhost:8000/api/candidats_par_election/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidats(res.data.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des candidats', err);
    }
  };

  const verifierSiDejaVote = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await axios.get(`http://localhost:8000/api/listes_votes?election_id=${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = JSON.parse(atob(token.split('.')[1])).sub;
      const aVote = res.data.data.some((vote: any) => vote.user_id == userId);
      setADejaVote(aVote);
    } catch (err) {
      console.error('Erreur lors de la vérification du vote', err);
    }
  };

  const fetchCandidatureDetails = async (candidatId: number) => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await axios.get(`http://localhost:8000/api/candidature/${electionId}/${candidatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidatureDetails(prev => ({ ...prev, [candidatId]: res.data.data }));
    } catch (error) {
      console.error("Erreur lors du chargement de la candidature", error);
    }
  };

  const toggleDetails = async (candidatId: number) => {
    if (detailsVisibles === candidatId) {
      setDetailsVisibles(null);
    } else {
      await fetchCandidatureDetails(candidatId);
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
        const token = localStorage.getItem('auth_token');
        await axios.post('http://localhost:8000/api/voter', {
          candidat_id: candidatId,
          election_id: electionId,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire('Vote enregistré !', '', 'success');
        setADejaVote(true);
      } catch (error: any) {
        const message = error.response?.data?.message || 'Impossible de voter.';
        Swal.fire('Erreur', message, 'error');
      }
    }
  };

  const handleTelechargementProgramme = (programmePath: string) => {
    const url = `http://localhost:8000/storage/${programmePath}`;
    window.open(url, '_blank');
  };

  return (
    <div className="candidats-page">
      <Appbar title="Liste des candidats" />
      <div className="candidats-layout">
        <SidebarElecteur />
        <div className="candidats-main">
          <h2 className="candidats-title">Candidats à cette élection</h2>
          <div className="candidat-cards">
            {Array.isArray(candidats) && candidats.map((candidat: any) => {
              const details = candidatureDetails[candidat.id];

              return (
                <div className="candidat-card" key={candidat.id}>
                  <img
                    src={candidat.profil ? `http://localhost:8000/storage/${candidat.profil}` : '/user.png'}
                    alt={candidat.nom}
                    className="candidat-image"
                  />
                  <h3>{candidat.prenom} {candidat.nom}</h3>
                  <p className="email">{candidat.email}</p>

                  {detailsVisibles === candidat.id && details && (
                    <div className="details">
                      <p><strong>Slogan :</strong> {details.slogan || 'Non renseigné'}</p>
                      <p><strong>Programme :</strong></p>
                      {details.programme && (
                        <button
                          className="download-button"
                          onClick={() => handleTelechargementProgramme(details.programme)}
                        >
                          Télécharger le programme
                        </button>
                      )}
                    </div>
                  )}

                  <div className="buttons">
                    {!aDejaVote && (
                      <button onClick={() => voterPourCandidat(candidat.id)}>Voter</button>
                    )}
                    <button onClick={() => toggleDetails(candidat.id)}>
                      {detailsVisibles === candidat.id ? 'Masquer' : 'Voir plus'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <FooterElecteur />
      </div>

      <style>
        {`
          .candidats-layout {
            display: flex;
            background-color: #f9f9f9;
          }

          .candidats-main {
            flex: 1;
            padding: 2rem;
            margin-left: 250px;
          }

          .candidats-title {
            color: #1976d2;
            margin-bottom: 1.5rem;
          }

          .candidat-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
          }

          @media (min-width: 1024px) {
            .candidat-cards {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          .candidat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
            border-left: 4px solid #03a9f4;
            transition: transform 0.2s ease;
          }

          .candidat-card:hover {
            transform: scale(1.02);
          }

          .candidat-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
            margin: 0 auto 0.5rem;
            display: block;
          }

          .candidat-card h3 {
            font-size: 1.1rem;
            margin: 0.3rem 0 0.3rem;
            color: #333;
          }

          .candidat-card .email {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.8rem;
          }

          .details {
            margin-top: 0.5rem;
            text-align: left;
            font-size: 0.9rem;
          }

          .download-button {
            margin-top: 0.5rem;
            padding: 0.4rem 0.7rem;
            font-size: 0.85rem;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .download-button:hover {
            background-color: #388e3c;
          }

          .buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 1rem;
          }

          .buttons button {
            flex: 1;
            padding: 0.5rem 0.9rem;
            background-color: #03a9f4;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 0.85rem;
            cursor: pointer;
          }

          .buttons button:hover {
            background-color: #0288d1;
          }
        `}
      </style>
    </div>
  );
};

export default CandidatsParElection;

  