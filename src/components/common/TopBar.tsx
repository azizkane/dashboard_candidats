import { ReactNode, useRef } from 'react';

interface TopBarProps {
  title: string;
  right?: ReactNode;
}

export const TopBar = ({ title, right }: TopBarProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <header ref={containerRef} className="fixed top-6 left-6 md:left-[19rem] right-6 h-14 bg-white/90 backdrop-blur border rounded-full shadow-md px-6 flex items-center justify-between z-40">
      <h1 className="text-xl font-semibold text-primary">{title}</h1>
      <div className="flex items-center gap-4 relative">{right}</div>
    </header>
  );
};

export default TopBar;


