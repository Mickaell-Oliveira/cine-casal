import { Film, Lock, Unlock } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Header({ isAdmin, onLoginClick, onLogoutClick }: HeaderProps) {
  return (
    <header className="bg-cinema-800 border-b border-cinema-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Film size={28} className="fill-accent/20" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Cine<span className="text-accent">Casal</span>
          </h1>
        </div>
        
        {isAdmin ? (
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-cinema-700 transition-colors"
            title="Sair do modo de edição"
          >
            <Unlock size={16} className="text-green-500" /> Edição Liberada
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-cinema-700 transition-colors"
            title="Entrar para editar"
          >
            <Lock size={16} /> Login
          </button>
        )}
      </div>
    </header>
  );
}
