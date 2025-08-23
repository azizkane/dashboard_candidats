import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Appbar from '../components/AppbarElecteur';
import SidebarElecteur from '../components/SidebarElecteur';
import FooterElecteur from '../components/FooterElecteur';
import {
  fetchElectionsList,
  getElectionImageUrl
} from '../api';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getElections = async () => {
      try {
        const data = await fetchElectionsList();
        setElections(data);
      } catch (err) {
        console.error('Erreur lors du chargement des élections', err);
      }
    };

    getElections();
  }, []);

  const handleParticiper = (id: string) => {
    navigate(`/election/${id}/candidats`);
  };

  return (
    <div className="elections-page">
      <Appbar title="Espace Électeur" />
      <div className="elections-layout">
        <SidebarElecteur />
        <div className="elections-main">
          <h2 className="elections-title">Liste des élections</h2>
          <div className="election-cards">
            {elections.map((election: any) => (
              <div className="election-card" key={election.id}>
                <img
                  src={getElectionImageUrl(election.image)}
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
      <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
            <FooterElecteur />
      </div>
      

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

export default Elections;