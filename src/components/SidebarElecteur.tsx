import { useNavigate } from 'react-router-dom';
import { User, Vote, Users, FileText, BarChart2, LogOut } from 'lucide-react';
import { logout } from '@/api';
import SidebarBase from '@/components/common/SidebarBase';

const SidebarElecteur = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("⚠️ Voulez-vous vraiment vous déconnecter ?");
    if (!confirmed) return;

    try {
        await logout();
        localStorage.removeItem('auth_token');
        navigate('/');
    } catch (err) {
        console.error(err);
        }
  };

  const items = [
    { to: '/electeur/profil', label: 'Mon Profil', icon: <User size={18} /> },
    { to: '/electeur/elections', label: 'Élections', icon: <Vote size={18} /> },
    { to: '/electeur/candidature', label: 'Déposer Candidature', icon: <Users size={18} /> },
    { to: '/electeur/resultats', label: 'Résultats', icon: <BarChart2 size={18} /> },
    { to: '/electeur/pv', label: 'Procès-verbaux', icon: <FileText size={18} /> },
  ];

  const footer = (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-full text-red-600 hover:bg-red-50 transition"
    >
      <LogOut size={18} />
      <span className="font-medium">Déconnexion</span>
    </button>
  );

  return (
    <SidebarBase title="Espace Électeur" items={items} footer={footer} />
  );
};

export default SidebarElecteur;
