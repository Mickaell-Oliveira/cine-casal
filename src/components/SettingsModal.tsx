import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setLocalApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalApiKey(getApiKey() || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(apiKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-cinema-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-cinema-700 animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-cinema-700 flex justify-between items-center bg-cinema-900/50">
          <h2 className="text-xl font-semibold text-white">Configurações</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
              TMDB API Key (v3 auth)
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              placeholder="Cole sua chave da API aqui..."
            />
            <p className="mt-2 text-xs text-gray-400">
              Para buscar filmes, você precisa de uma chave de API gratuita do{' '}
              <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                TMDB
              </a>.
            </p>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-cinema-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg font-medium bg-accent text-white hover:bg-red-700 shadow-lg shadow-accent/20 transition-all"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
