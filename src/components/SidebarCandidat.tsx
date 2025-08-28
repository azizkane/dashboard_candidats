import { User, Vote, Users, FileText, BarChart2, LogOut } from 'lucide-react';
import SidebarBase from '@/components/common/SidebarBase';

const SidebarCandidat = () => {


  const items = [
    { to: '/candidat/profil', label: 'Mon Profil', icon: <User size={18} /> },
    { to: '/candidat/elections', label: 'Élections', icon: <Vote size={18} /> },
    { to: '/candidat/ma_candidature', label: 'Candidature', icon: <Vote size={18} /> },
    { to: '/candidat/resultats', label: 'Résultats', icon: <BarChart2 size={18} /> },
    { to: '/candidat/pv', label: 'Procès-verbaux', icon: <FileText size={18} /> },
  ];

  const footer = (
    <center>
      <hr />
      <span className="font-light mt-10">Votify</span>
    </center>
  );


  return (
    <SidebarBase title="Espace Candidat" items={items} footer={footer} />
  );
};

export default SidebarCandidat;
