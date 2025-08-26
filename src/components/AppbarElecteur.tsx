// src/components/AppBarElecteur.tsx
import TopBar from '@/components/common/TopBar';
import NotificationsBell from '@/components/common/NotificationsBell';
import AccountMenu from '@/components/common/AccountMenu';

interface AppBarElecteurProps {
  title: string;
}

const AppBarElecteur = ({ title }: AppBarElecteurProps) => {
  return (
    <TopBar
      title={title}
      right={
        <>
          <NotificationsBell loginRoute="/login-electeur" />
          <AccountMenu profileRoute="/electeur/profil" />
        </>
      }
    />
  );
};

export default AppBarElecteur;
