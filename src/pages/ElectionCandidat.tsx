import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/common/AppShell';
import { fetchElectionsListForCandidate, getElectionImageUrl } from '../api';

const ElectionsCandidat = () => {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getElections = async () => {
      try {
        const data = await fetchElectionsListForCandidate();
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
      <AppShell role="candidat" title="Espace Candidat">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Élections</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election: any) => (
              <div key={election.id} className="bg-white p-5 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition">
                <img
                  src={getElectionImageUrl(election.image)}
                  alt={election.titre}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-foreground">{election.titre}</h3>
                <p className="text-sm text-muted-foreground">{election.description}</p>
                <p><strong>Début :</strong> {election.date_debut}</p>
                <p><strong>Fin :</strong> {election.date_fin}</p>
                <button
                  onClick={() => handleParticiper(election.id)}
                  className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#275dad] text-white font-semibold hover:bg-[#1f4c8d]"
                >
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

export default ElectionsCandidat;
