// src/components/AppBarCandidat.tsx
import TopBar from '@/components/common/TopBar';
import NotificationsBell from '@/components/common/NotificationsBell';
import AccountMenu from '@/components/common/AccountMenu';

interface AppBarCandidatProps {
  title: string;
}

const AppBarCandidat = ({ title }: AppBarCandidatProps) => {
  return (
    <TopBar
      title={title}
      right={
        <>
          <NotificationsBell loginRoute="/login-candidat" />
          <AccountMenu profileRoute="/candidat/profil" />
        </>
      }
    />
  );
};

export default AppBarCandidat;
