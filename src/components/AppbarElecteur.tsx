// src/components/AppBarElecteur.tsx
import { Bell, User } from 'lucide-react';

interface AppBarElecteurProps {
  title: string;
}

const AppBarElecteur = ({ title }: AppBarElecteurProps) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md px-6 flex items-center justify-between z-40">
      <h1 className="text-xl font-semibold text-blue-600">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-blue-600 transition">
          <Bell size={20} />
        </button>

        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer">
          <User size={18} />
        </div>
      </div>
    </header>
  );
};

export default AppBarElecteur;
