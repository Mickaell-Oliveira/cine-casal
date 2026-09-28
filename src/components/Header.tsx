import { Film } from 'lucide-react';

interface HeaderProps {}

export function Header({}: HeaderProps) {
  return (
    <header className="bg-cinema-800 border-b border-cinema-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Film size={28} className="fill-accent/20" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Cine<span className="text-accent">Casal</span>
          </h1>
        </div>
      </div>
    </header>
  );
}
