import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarCandidat from '@/components/SidebarCandidat';
import Appbar from '@/components/AppbarCandidat';
import FooterCandidat from '@/components/FooterCandidat';

const ModifierCandidature = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slogan, setSlogan] = useState('');
  const [programme, setProgramme] = useState<File | null>(null);
  const [lettreMotivation, setLettreMotivation] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCandidature = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get(`http://localhost:8000/api/candidature/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.data;
        setSlogan(data.slogan || '');
      } catch (err) {
        console.error('Erreur chargement candidature', err);
      }
    };

    fetchCandidature();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('auth_token');

    const formData = new FormData();
    formData.append('slogan', slogan);
    if (programme) formData.append('programme', programme);
    if (lettreMotivation) formData.append('lettre_motivation', lettreMotivation);

    try {
      await axios.post(`http://localhost:8000/api/modifier_candidature/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Candidature mise à jour avec succès !');
      navigate('/candidat/ma_candidature');
    } catch (err) {
      console.error('Erreur modification', err);
      alert('❌ Une erreur est survenue lors de la modification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarCandidat />
      <div className="flex-1 flex flex-col">
        <Appbar title="Modifier Candidature" />
        <main className="flex-1 flex items-center justify-center py-10 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6"
          >
            <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
              Modifier ma Candidature
            </h1>

            <div>
              <label className="font-medium text-gray-700">Slogan</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">
                Nouveau programme (.pdf, .doc, .docx)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setProgramme(e.target.files?.[0] || null)}
                className="w-full mt-1"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">
                Nouvelle lettre de motivation (.pdf, .doc, .docx)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setLettreMotivation(e.target.files?.[0] || null)}
                className="w-full mt-1"
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
              >
                {loading ? 'Enregistrement...' : '💾 Sauvegarder'}
              </button>
            </div>
          </form>
        </main>
        <FooterCandidat />
      </div>
    </div>
  );
};

export default ModifierCandidature;
