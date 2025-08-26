import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { logout } from '@/api';

interface AccountMenuProps {
  profileRoute: string;
  homeRoute?: string;
}

export const AccountMenu = ({ profileRoute, homeRoute = '/' }: AccountMenuProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {} finally {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth_token');
      setOpen(false);
      navigate(homeRoute);
    }
  };

  return (
    <div className="relative">
      <button
        ref={userBtnRef}
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer hover:opacity-90"
        title="Compte"
        type="button"
      >
        <User size={18} />
      </button>

      {open && (
        <div
          ref={userMenuRef}
          className="absolute right-0 top-10 w-48 bg-white border rounded-xl shadow-lg py-2 z-50"
        >
          <button
            onClick={() => { setOpen(false); navigate(profileRoute); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            type="button"
          >
            Mon profil
          </button>
          <div className="my-1 h-px bg-gray-100" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            type="button"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;


