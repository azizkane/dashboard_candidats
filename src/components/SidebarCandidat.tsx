import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Vote, Users, FileText, BarChart2, LogOut } from 'lucide-react';
import axios from 'axios';

const SidebarCandidat = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItem = (to: string, icon: JSX.Element, label: string) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-5 py-3 hover:bg-blue-700 hover:text-white transition ${
        pathname === to ? 'bg-blue-700 text-white' : 'text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );

  const handleLogout = async () => {
    const confirmed = window.confirm("⚠️ Voulez-vous vraiment vous déconnecter ?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("auth_token");
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("auth_token");
      navigate("/");
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion :", error.response?.status, error.response?.data);
      alert("❌ Une erreur est survenue pendant la déconnexion.");
    }
  };

  return (
    <aside className="w-64 bg-blue-600 text-white min-h-screen fixed flex flex-col">
      <div className="flex items-center justify-center py-6 border-b border-blue-400">
        <img src="/logo1.jpg" alt="Logo" className="w-8 h-8 mr-2" />
        <span className="text-lg font-bold">Appli Votify</span>
      </div>

      <nav className="flex flex-col mt-4">
        {navItem('/candidat/profil', <User size={18} />, 'Mon Profil')}
        {navItem('/candidat/elections', <Vote size={18} />, 'Élections')}
        {navItem('/candidat/ma_candidature', <Vote size={18} />, 'Candidature')}
        {navItem('/candidat/resultats', <BarChart2 size={18} />, 'Résultats')}
        {navItem('/candidat/pv', <FileText size={18} />, 'Procès-verbaux')}
      </nav>

      <div className="mt-auto border-t border-blue-400">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-red-600 hover:text-white transition text-white"
        >
          <LogOut size={18} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarCandidat;
