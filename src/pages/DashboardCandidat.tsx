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
import { fetchCandidateProfile } from '../api';

// Reuse CardLink

const DashboardCandidat = () => {
  const [nom, setNom] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchCandidateProfile();
        setNom(`${res?.prenom ?? ''} ${res?.nom ?? ''}`.trim());
      } catch (error) {
        setNom('');
        console.error("Error fetching candidate profile:", error);
      }
    };
    getProfile();
  }, []);

  return (
    <>
      <AppShell role="candidat" title="Espace Candidat">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-10">
              Bienvenue {nom || 'Candidat'}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <CardLink
                title="Élections disponibles"
                to="/candidat/elections"
                icon={<Vote size={40} />}
                button="Voir"
              />

               <CardLink
                title="Candidatures"
                to="/candidat/ma_candidature"
                icon={<BarChart2 size={40} />}
                button="Voir ma candidature"
              />

              <CardLink
                title="Résultats"
                to="/candidat/resultats"
                icon={<BarChart2 size={40} />}
                button="Voir résultats"
              />

              <CardLink
                title="Télécharger PV"
                to="/candidat/pv"
                icon={<FileText size={40} />}
                button="Télécharger"
              />
            </div>
          </div>
      </AppShell>
    </>
  );
};

export default DashboardCandidat;
