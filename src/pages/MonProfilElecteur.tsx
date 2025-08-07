import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import SidebarElecteur from '@/components/SidebarElecteur';
import AppBar from '@/components/AppbarElecteur';
import FooterElecteur from '@/components/FooterElecteur';

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
      <SidebarElecteur />
      <div className="flex flex-col flex-1">
        <AppBar title="Espace Électeur" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
    
      <FooterElecteur />
    
  </div>
);

const MonProfilElecteur = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    role: '',
    profil: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios
        .get('http://127.0.0.1:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setFormData(res.data);
        });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    if (token && user) {
      axios
        .put(`http://127.0.0.1:8000/api/users/${user.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setEditMode(false);
        });
    }
  };

  if (!user) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white mt-20 p-8 rounded-xl shadow-md border border-gray-200">
        {!editMode ? (
          <div className="text-center">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600">Mon Profil</h2>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={() => setEditMode(true)}
              >
                <Pencil size={18} />
                Modifier
              </button>
            </div>
            <div className="flex flex-col items-center gap-3 mt-6">
              <img
              src={`http://127.0.0.1:8000/storage/${user.profil}`}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border shadow"
              />
              <p className="mt-2"><strong>Nom :</strong> {user.nom}</p>
              <p><strong>Prénom :</strong> {user.prenom}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Rôle :</strong> {user.role}</p>
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
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default MonProfilElecteur;
