import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Appbar from '../components/AppbarElecteur';
import SidebarElecteur from '../components/SidebarElecteur';
import FooterElecteur from '../components/FooterElecteur';

interface Candidat {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  profil?: string;
  total_votes?: number;
}

const ResultatsParElection = () => {
  const { id: electionId } = useParams();
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [candidatEnTeteId, setCandidatEnTeteId] = useState<number | null>(null);

  const fetchCandidats = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const res = await axios.get(`http://localhost:8000/api/candidats_par_election/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data || [];

      // Trier par total_votes décroissant
      const sorted = [...data].sort((a, b) => (b.total_votes ?? 0) - (a.total_votes ?? 0));
      setCandidats(sorted);

      if (sorted.length > 0) {
        setCandidatEnTeteId(sorted[0].id);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des candidats', err);
    }
  };

  useEffect(() => {
    fetchCandidats(); // première exécution
    const interval = setInterval(fetchCandidats, 10000); // mise à jour toutes les 10 secondes

    return () => clearInterval(interval); // nettoyage
  }, [electionId]);

  return (
    <div className="candidats-page">
      <Appbar title="Résultats par élection" />
      <div className="candidats-layout">
        <SidebarElecteur />
        <div className="candidats-main">
          <h2 className="candidats-title">Suivi en temps réel des votes</h2>
          <div className="candidat-cards">
            {candidats.map((candidat) => (
              <div
                key={candidat.id}
                className={`candidat-card ${
                  candidat.id === candidatEnTeteId ? 'en-tete' : ''
                }`}
              >
                <img
                  src={
                    candidat.profil
                      ? `http://localhost:8000/storage/${candidat.profil}`
                      : '/user.png'
                  }
                  alt={candidat.nom}
                  className="candidat-image"
                />
                <h3>{candidat.prenom} {candidat.nom}</h3>
                <p className="email">{candidat.email}</p>
                <p className="votes"><strong>Votes :</strong> {candidat.total_votes ?? 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ paddingTop: '160px' }}>
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

          .candidat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
            border-left: 4px solid #03a9f4;
            transition: transform 0.2s ease;
          }

          .candidat-card.en-tete {
            border-left: 6px solid #4caf50;
            box-shadow: 0 0 0 3px #e8f5e9;
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

          .candidat-card .votes {
            font-size: 1rem;
            font-weight: bold;
            color: #000;
          }

          @media (min-width: 1024px) {
            .candidat-cards {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResultatsParElection;
