import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardLinkProps {
  to: string;
  title: string;
  icon: ReactNode;
  button: string;
}

export const CardLink = ({ to, title, icon, button }: CardLinkProps) => (
  <Link
    to={to}
    className="bg-white shadow-md border border-blue-600 border-opacity-20 rounded-xl p-6 text-left hover:shadow-lg hover:scale-[1.03] transition-all duration-300 flex flex-col items-start gap-4 border-l-4"
  >
    <div className="text-primary">{icon}</div>
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    <button className="mt-2 bg-primary text-white px-4 py-2 rounded-full hover:opacity-90 text-sm flex items-center gap-2">
      {button}
    </button>
  </Link>
);

export default CardLink;


