import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarElecteur from '@/components/SidebarElecteur';
import AppBar from '@/components/AppbarElecteur';
import FooterElecteur from '@/components/FooterElecteur';
import axios from 'axios';
import {
  Vote,
  Users,
  BarChart2,
  FileText,
  CircleArrowRight
} from 'lucide-react';

interface CardProps {
  title: string;
  to: string;
  icon: JSX.Element;
  button: string;
}

const Card = ({ title, to, icon, button }: CardProps) => (
  <Link
    to={to}
    className="bg-white shadow-md border border-gray-200 rounded-xl p-6 text-left hover:shadow-lg hover:scale-[1.03] transition-all duration-300 flex flex-col items-start gap-4 border-l-4 border-blue-600"
  >
    <div className="text-blue-600">{icon}</div>
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-2">
      {button}
      <CircleArrowRight size={16} />
    </button>
  </Link>
);

const DashboardElecteur = () => {
  const [nom, setNom] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios
        .get('http://127.0.0.1:8000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setNom(`${res.data?.prenom ?? ''} ${res.data?.nom ?? ''}`.trim()))
        .catch(() => setNom(''));
    }
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <SidebarElecteur />

        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-gray-100">
          <AppBar title="Espace Électeur" />

          <div className="flex-grow p-8 mt-16 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-blue-700 mb-10">
              Bienvenue {nom || 'Électeur'}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card
                title="Élections disponibles"
                to="/electeur/elections"
                icon={<Vote size={40} />}
                button="Voir"
              />

              <Card
                title="Résultats"
                to="/electeur/resultats"
                icon={<BarChart2 size={40} />}
                button="Voir résultats"
              />

              <Card
                title="Télécharger PV"
                to="/electeur/pv"
                icon={<FileText size={40} />}
                button="Télécharger"
              />
            </div>
          </div>
        </div>
      </div>

      <FooterElecteur />
    </>
  );
};

export default DashboardElecteur;
