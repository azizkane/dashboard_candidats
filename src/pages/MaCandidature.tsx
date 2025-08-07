import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarCandidat from '@/components/SidebarCandidat';
import Appbar from '@/components/AppbarCandidat';
import FooterCandidat from '@/components/FooterCandidat';
import { useNavigate } from 'react-router-dom';

interface Candidature {
  id: number;
  email?: string;
  election: {
    titre: string;
  };
  programme: string;
  lettre_motivation: string;
  slogan: string;
}

const MaCandidature = () => {
  const [candidature, setCandidature] = useState<Candidature | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidature = async () => {
      const token = localStorage.getItem('auth_token');
      try {
        const res = await axios.get('http://localhost:8000/api/ma_candidature', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidature(res.data.data);
      } catch (err) {
        console.error('Erreur lors du chargement de la candidature', err);
      }
    };

    fetchCandidature();
  }, []);

  const handleModifier = () => {
    if (candidature) {
      navigate(`/candidat/modifier-candidature/${candidature.id}`);
    }
  };

  const handleSupprimer = async () => {
    if (!candidature) return;
    const confirm = window.confirm('Voulez-vous vraiment supprimer votre candidature ?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`http://localhost:8000/api/supprimer_candidature/${candidature.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Candidature supprimée avec succès.');
      navigate('/candidat/dashboard');
    } catch (err) {
      console.error('Erreur lors de la suppression', err);
      alert('Une erreur est survenue.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarCandidat />
      <div className="flex-1 flex flex-col">
        <Appbar title="Espace Candidat" />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-xl shadow border border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Ma Candidature</h1>

            {!candidature ? (
              <p className="text-center text-gray-500">Chargement en cours...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                <div className="space-y-3">
                  {candidature.email && (
                    <p><span className="font-semibold">📧 Email :</span> {candidature.email}</p>
                  )}
                  <p><span className="font-semibold">🗳️ Élection :</span> {candidature.election?.titre}</p>
                  <p><span className="font-semibold">💬 Slogan :</span> {candidature.slogan}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">📄 Programme :</p>
                    <a
                      href={`http://localhost:8000/storage/${candidature.programme}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Télécharger le programme
                    </a>
                  </div>

                  <div>
                    <p className="font-semibold">📝 Lettre de motivation :</p>
                    <a
                      href={`http://localhost:8000/storage/${candidature.lettre_motivation}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Télécharger la lettre
                    </a>
                  </div>
                </div>
              </div>
            )}

            {candidature && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={handleModifier}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow"
                >
                  ✏️ 
                </button>
                <button
                  onClick={handleSupprimer}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        </main>
        <FooterCandidat />
      </div>
    </div>
  );
};

export default MaCandidature;
