import { useNavigate } from 'react-router-dom';
import { User, Vote, Users, FileText, BarChart2, LogOut } from 'lucide-react';
import { logout } from '@/api';
import SidebarBase from '@/components/common/SidebarBase';

const SidebarCandidat = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("⚠️ Voulez-vous vraiment vous déconnecter ?");
    if (!confirmed) return;

    try {
      await logout();

      localStorage.removeItem("auth_token");
      navigate("/");
    } catch (error: unknown) {
      console.error("Erreur lors de la déconnexion :", error);
      alert("❌ Une erreur est survenue pendant la déconnexion.");
    }
  };

  const items = [
    { to: '/candidat/profil', label: 'Mon Profil', icon: <User size={18} /> },
    { to: '/candidat/elections', label: 'Élections', icon: <Vote size={18} /> },
    { to: '/candidat/ma_candidature', label: 'Candidature', icon: <Vote size={18} /> },
    { to: '/candidat/resultats', label: 'Résultats', icon: <BarChart2 size={18} /> },
    { to: '/candidat/pv', label: 'Procès-verbaux', icon: <FileText size={18} /> },
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
    <SidebarBase title="Espace Candidat" items={items} footer={footer} />
  );
};

export default SidebarCandidat;
