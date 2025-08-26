import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface SidebarItem {
  to: string;
  label: string;
  icon: ReactNode;
}

interface SidebarBaseProps {
  title: string;
  items: SidebarItem[];
  footer?: ReactNode;
}

export const SidebarBase = ({ title, items, footer }: SidebarBaseProps) => {
  const { pathname } = useLocation();

  return (
    <aside className="fixed top-6 left-6 bottom-6 w-64 bg-white text-foreground rounded-2xl shadow-lg border flex flex-col">
      <div className="flex items-center gap-2 px-5 py-5 border-b">
        <img src="/logo1.jpg" alt="Logo" className="w-9 h-9 rounded-full object-cover" />
        <div>
          <div className="text-sm text-muted-foreground">Votify</div>
          <div className="text-base font-semibold text-primary">{title}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {items.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition ${
              pathname === to ? 'bg-primary text-white shadow-sm' : 'text-foreground hover:bg-primary/10'
            }`}
          >
            {icon}
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {footer ? <div className="mt-auto p-4">{footer}</div> : null}
    </aside>
  );
};

export default SidebarBase;


