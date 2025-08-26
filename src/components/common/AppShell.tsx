import { ReactNode } from 'react';
import SidebarElecteur from '@/components/SidebarElecteur';
import SidebarCandidat from '@/components/SidebarCandidat';
import TopBar from '@/components/common/TopBar';
import NotificationsBell from '@/components/common/NotificationsBell';
import AccountMenu from '@/components/common/AccountMenu';
import FooterBase from '@/components/common/FooterBase';

interface AppShellProps {
  role: 'electeur' | 'candidat';
  title: string;
  children: ReactNode;
}

export const AppShell = ({ role, title, children }: AppShellProps) => {
  const isElecteur = role === 'electeur';
  const loginRoute = isElecteur ? '/login-electeur' : '/login-candidat';
  const profileRoute = isElecteur ? '/electeur/profil' : '/candidat/profil';

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {isElecteur ? <SidebarElecteur /> : <SidebarCandidat />}

      <div className="flex-1 pl-6 md:pl-[19rem] pr-6 flex flex-col min-h-screen">
        <TopBar
          title={title}
          right={
            <>
              <NotificationsBell loginRoute={loginRoute} />
              <AccountMenu profileRoute={profileRoute} />
            </>
          }
        />

        <main className="relative flex-grow min-h-[9xl] p-4 md:p-6 mt-[100px] pb-2 max-w-8xl mx-auto w-full border bg-white shadow-lg rounded-2xl">
          {children}
        </main>
          <FooterBase />

        {/* Footer inside the shell to align with sidebar/topbar offsets */}
      </div>
    </div>
  );
};

export default AppShell;


