import { useState } from 'react';
import { X, Lock, Unlock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => Promise<{ success: boolean; error?: string }>;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await onLogin(password);
    
    setLoading(false);
    if (result.success) {
      setPassword('');
      onClose();
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-cinema-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-cinema-700 animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-cinema-700 flex justify-between items-center bg-cinema-900/50">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-accent" />
            <h2 className="text-lg font-semibold text-white">Acesso Restrito</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Senha de Edição
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-cinema-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-red-700 shadow-lg shadow-accent/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : (
                <>
                  <Unlock size={16} /> Desbloquear
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
