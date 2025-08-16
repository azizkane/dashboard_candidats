import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import SidebarCandidat from '@/components/SidebarCandidat';
import AppBar from '@/components/AppbarCandidat';
import FooterCandidat from '@/components/FooterCandidat';

interface UserData {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  profil?: string | null;
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <div className="flex flex-1">
      <SidebarCandidat />
      <div className="flex flex-col flex-1">
        <AppBar title="Espace Candidat" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
    <FooterCandidat />
  </div>
);

// Skeleton simple (optionnel)
const Skel = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const MonProfilCandidat = () => {
  // 1) Rendu immédiat depuis le cache (clé distincte pour le candidat)
  const cached = (() => {
    try { return JSON.parse(localStorage.getItem('me_candidat') || 'null') as UserData | null; }
    catch { return null; }
  })();

  const [user, setUser] = useState<UserData | null>(cached);
  const [formData, setFormData] = useState<UserData>(
    cached ?? { id: 0, nom: '', prenom: '', email: '', role: '', profil: '' }
  );
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState<number>(0);

  // 2) Rafraîchissement silencieux depuis l’API (sans écran “Chargement...”)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    axios.get('http://127.0.0.1:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const fresh = res.data as UserData;
      setUser(fresh);
      setFormData(fresh);
      localStorage.setItem('me_candidat', JSON.stringify(fresh));
    })
    .catch(() => {
      // On garde le cache si l’appel échoue
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3) Sauvegarde avec UI optimiste
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    if (!token || !formData.id) return;

    setSaving(true);
    const prev = user;

    // UI optimiste: on affiche tout de suite les nouvelles valeurs
    setUser(formData);
    localStorage.setItem('me_candidat', JSON.stringify(formData));

    axios.put(`http://127.0.0.1:8000/api/users/${formData.id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
    .then((res) => {
      // Gère {user: {...}} ou {data: {...}} ou {...}
      const updated =
        (res.data && (res.data.user || res.data.data)) ? (res.data.user || res.data.data) :
        (typeof res.data === 'object' ? res.data : formData);

      setUser(updated);
      setFormData(updated);
      localStorage.setItem('me_candidat', JSON.stringify(updated));
      setEditMode(false);

      // Si la photo change, buster le cache une seule fois
      setAvatarVersion(Date.now());
    })
    .catch((err) => {
      // rollback si échec
      if (prev) {
        setUser(prev);
        setFormData(prev);
        localStorage.setItem('me_candidat', JSON.stringify(prev));
      }
      console.error('Erreur de modification :', err?.response?.data || err);
    })
    .finally(() => setSaving(false));
  };

  // 4) Avatar avec anti-cache déclenché après update
  const avatar = user?.profil
    ? `http://127.0.0.1:8000/storage/${user.profil}${avatarVersion ? `?v=${avatarVersion}` : ''}`
    : '';

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white mt-20 p-8 rounded-xl shadow-md border border-gray-200">
        {!editMode ? (
          <div className="text-center">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600">Mon Profil</h2>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => { if (user) setFormData(user); setEditMode(true); }}
              >
                <Pencil size={18} />
                Modifier
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 mt-6">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-28 h-28 rounded-full object-cover border shadow"
                />
              ) : (
                <Skel className="w-28 h-28 rounded-full" />
              )}

              <p className="mt-2">
                <strong>Nom :</strong>{' '}
                {user?.nom ? user.nom : <Skel className="inline-block align-middle w-24 h-4" />}
              </p>
              <p>
                <strong>Prénom :</strong>{' '}
                {user?.prenom ? user.prenom : <Skel className="inline-block align-middle w-28 h-4" />}
              </p>
              <p>
                <strong>Email :</strong>{' '}
                {user?.email ? user.email : <Skel className="inline-block align-middle w-40 h-4" />}
              </p>
              <p>
                <strong>Rôle :</strong>{' '}
                {user?.role ? user.role : <Skel className="inline-block align-middle w-20 h-4" />}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Modifier mon profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rôle</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  readOnly
                  className="w-full border bg-gray-100 border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default MonProfilCandidat;
