import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Appbar from '../components/AppbarCandidat';
import SidebarCandidat from '../components/SidebarCandidat';
import FooterCandidat from '../components/FooterCandidat';

const ElectionsCandidat = () => {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem('auth_token');
      try {
        const res = await axios.get('http://localhost:8000/api/liste_elections', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setElections(res.data.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des élections', err);
      }
    };

    fetchElections();
  }, []);

  const handleParticiper = (id: string) => {
    navigate(`/election/${id}/candidats`);
  };

  return (
    <div className="elections-page">
      <Appbar title="Espace Candidat" />
      <div className="elections-layout">
        <SidebarCandidat />
        <div className="elections-main">
          <h2 className="elections-title">Liste des élections</h2>
          <div className="election-cards">
            {elections.map((election: any) => (
              <div className="election-card" key={election.id}>
                <img
                  src={`http://localhost:8000/storage/${election.image}`}
                  alt={election.titre}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <h3>{election.titre}</h3>
                <p>{election.description}</p>
                <p><strong>Date de début :</strong> {election.date_debut}</p>
                <p><strong>Date de fin :</strong> {election.date_fin}</p>
                <button onClick={() => handleParticiper(election.id)}>
                  Voir candidats
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterCandidat />

      <style>
        {`
          .elections-layout {
            display: flex;
            background-color: #f0f4f8;
          }

          .elections-main {
            flex: 1;
            padding: 2rem;
            margin-left: 250px;
          }

          .elections-title {
            color: #007bff;
            margin-bottom: 2rem;
          }

          .election-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .election-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-left: 4px solid #03a9f4;
          }

          .election-card h3 {
            margin-top: 0;
          }

          .election-card button {
            margin-top: 1rem;
            padding: 0.6rem 1rem;
            background-color: #03a9f4;
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
          }

          .election-card button:hover {
            background-color: #0288d1;
          }
        `}
      </style>
    </div>
  );
};

export default ElectionsCandidat;
