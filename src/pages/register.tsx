// src/pages/RegisterElecteur.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type FormState = {
  nom: string;
  prenom: string;
  email: string;
};

type ErrorBag = Partial<Record<'nom' | 'prenom' | 'email', string[]>>;

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? 'http://127.0.0.1:8000';

const RegisterElecteur = () => {
  const [form, setForm] = useState<FormState>({ nom: '', prenom: '', email: '' });
  const [errors, setErrors] = useState<ErrorBag>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null); // aperçu local (non envoyé)
  const navigate = useNavigate();

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const onChoosePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // validations simples côté front
    const nextErrors: ErrorBag = {};
    if (!form.nom.trim()) nextErrors.nom = ['Le nom est requis.'];
    if (!form.prenom.trim()) nextErrors.prenom = ['Le prénom est requis.'];
    if (!form.email.trim()) nextErrors.email = ['L’email est requis.'];
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      // IMPORTANT: envoyer en JSON
      const payload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
      };

      await axios.post(`${API_BASE}/api/register`, payload, {
        headers: { Accept: 'application/json' },
      });

      alert(
        "Compte créé avec succès. Le mot de passe par défaut  vous a été envoyé par e-mail."
      );
      navigate('/login-electeur');
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 422 && data?.errors) {
        setErrors(data.errors as ErrorBag);
      } else {
        alert(
          data?.message ??
            "Échec de l'inscription. Vérifiez le serveur et réessayez."
        );
      }
    } finally {
      setLoading(false);
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
       
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-1/2 bg-white flex justify-center items-center p-8">
        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl shadow-xl w-full max-w-xl p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center mb-2">
              {preview ? (
                <img src={preview} alt="Aperçu" className="w-24 h-24 object-cover" />
              ) : (
                <span className="text-3xl">📷</span>
              )}
            </div>
            <label className="text-sm font-semibold cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={onChoosePhoto} />
              Choisir une photo (facultatif)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              (La photo n’est pas encore envoyée au serveur à cette étape)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                placeholder="Nom"
                className="border px-4 py-2 rounded w-full"
                value={form.nom}
                onChange={onChange('nom')}
              />
              {errors.nom && <p className="text-red-600 text-xs mt-1">{errors.nom[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                placeholder="Prénom"
                className="border px-4 py-2 rounded w-full"
                value={form.prenom}
                onChange={onChange('prenom')}
              />
              {errors.prenom && <p className="text-red-600 text-xs mt-1">{errors.prenom[0]}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              placeholder="Email"
              className="border px-4 py-2 rounded w-full"
              value={form.email}
              onChange={onChange('email')}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer le compte'}
          </button>

          <p className="text-center text-sm">
            Déjà inscrit ?{' '}
            <a onClick={() => navigate('/login-electeur')} className="text-blue-600 hover:underline cursor-pointer">
              Se connecter
            </a>
          </p>

          <p className="text-xs text-gray-500 mt-4">
            Astuce : le mot de passe initial est <span className="font-semibold"></span> (envoyé par e-mail).
            Vous pourrez le changer après connexion si vous le souhaitez.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterElecteur;
