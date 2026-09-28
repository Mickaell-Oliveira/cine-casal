import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cinecasal_is_admin');
    if (stored === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = async (password: string) => {
    try {
      // Usar a mesma lógica de fallback do Vercel
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAdmin(true);
        localStorage.setItem('cinecasal_is_admin', 'true');
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || 'Senha incorreta' };
      }
    } catch (err) {
      console.warn("API de verificação de senha indisponível localmente, permitindo acesso para desenvolvimento.");
      // Se a API não existir (desenvolvimento local sem Vercel), checamos contra uma env de dev
      if (password === import.meta.env.VITE_DEV_PASSWORD) {
        setIsAdmin(true);
        localStorage.setItem('cinecasal_is_admin', 'true');
        return { success: true };
      }
      return { success: false, error: 'Erro de conexão ou senha incorreta' };
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('cinecasal_is_admin');
  };

  return { isAdmin, login, logout };
};
