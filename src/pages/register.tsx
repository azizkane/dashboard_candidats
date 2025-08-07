// src/pages/RegisterCandidat.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterCandidat = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    profil: null as File | null,
    role: 'candidat',
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Compte créé avec succès');
      navigate('/login-candidat');
    } catch (err) {
      alert("Échec de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur Votify</h1>
        <p className="text-lg mb-8 text-center max-w-sm">
          Votre plateforme sécurisée pour participer aux élections démocratiques en ligne
        </p>
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-2xl font-semibold">100%</div>
            <div className="text-sm">Sécurisé</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">24/7</div>
            <div className="text-sm">Disponible</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORMULAIRE */}
      <div className="w-1/2 bg-white flex justify-center items-center p-8">
        <div className="bg-white border rounded-2xl shadow-xl w-full max-w-xl p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <span className="text-3xl">📷</span>
            </div>
            <label className="text-sm font-semibold cursor-pointer">
              <input type="file" className="hidden" onChange={e => setForm({ ...form, profil: e.target.files?.[0] || null })} />
              Choisir une photo
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nom"
              className="border px-4 py-2 rounded w-full"
              onChange={e => setForm({ ...form, nom: e.target.value })}
            />
            <input
              type="text"
              placeholder="Prénom"
              className="border px-4 py-2 rounded w-full"
              onChange={e => setForm({ ...form, prenom: e.target.value })}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="border px-4 py-2 rounded w-full mb-4"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="password"
              placeholder="Mot de passe"
              className="border px-4 py-2 rounded w-full"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="border px-4 py-2 rounded w-full"
              onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition mb-4"
          >
            Créer le compte
          </button>

          <p className="text-center text-sm">
            Déjà inscrit ?{' '}
            <a onClick={() => navigate('/login-candidat')} className="text-blue-600 hover:underline cursor-pointer">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCandidat;
