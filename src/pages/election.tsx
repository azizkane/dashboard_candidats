import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/common/AppShell';
import {
  fetchElectionsList,
  getElectionImageUrl
} from '../api';

interface Election {
  id: number;
  titre: string;
  description?: string;
  image?: string;
  date_debut?: string;
  date_fin?: string;
}

const Elections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [query, setQuery] = useState('');
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

  const handleParticiper = (id: number) => {
    navigate(`/election/${id}/candidats`);
  };

  return (
    <div className="elections-page">
      <AppShell role="electeur" title="Espace Électeur">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Liste des élections</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-full md:w-72 px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections
              .filter((e: Election) => !query || (e.titre || '').toLowerCase().includes(query.toLowerCase()))
              .map((election: Election) => (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition" key={election.id}>
                <img
                  src={getElectionImageUrl(election.image)}
                  alt={election.titre}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-foreground">{election.titre}</h3>
                <p className="text-sm text-muted-foreground">{election.description}</p>
                <p><strong>Date de début :</strong> {election.date_debut}</p>
                <p><strong>Date de fin :</strong> {election.date_fin}</p>
                <button onClick={() => handleParticiper(election.id)} className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#275dad] text-white font-semibold hover:bg-[#1f4c8d]">
                  Voir candidats
                </button>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    </div>
  );
};

export default Elections;