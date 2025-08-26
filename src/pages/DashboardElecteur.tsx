import { useEffect, useState } from 'react';
import AppShell from '@/components/common/AppShell';
import { CardLink } from '@/components/common/CardLink';
import {
  Vote,
  Users,
  BarChart2,
  FileText,
  CircleArrowRight
} from 'lucide-react';
import { fetchVoterProfile } from '../api';

// Reuse CardLink

const DashboardElecteur = () => {
  const [nom, setNom] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchVoterProfile();
        setNom(`${res?.prenom ?? ''} ${res?.nom ?? ''}`.trim());
      } catch (error) {
        setNom('');
        console.error("Error fetching voter profile:", error);
      }
    };
    getProfile();
  }, []);

  return (
    <>
      <AppShell role="electeur" title="Espace Électeur">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-10">
              Bienvenue {nom || 'Électeur'}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <CardLink
                title="Élections disponibles"
                to="/electeur/elections"
                icon={<Vote size={40} />}
                button="Voir"
              />

              <CardLink
                title="Résultats"
                to="/electeur/resultats"
                icon={<BarChart2 size={40} />}
                button="Voir résultats"
              />

              <CardLink
                title="Télécharger PV"
                to="/electeur/pv"
                icon={<FileText size={40} />}
                button="Télécharger"
              />
            </div>
          </div>
      </AppShell>
    </>
  );
};

export default DashboardElecteur;
