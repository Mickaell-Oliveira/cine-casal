import type { TMDBResponse, Movie } from '../types';

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];

  // Em produção (na Vercel) vai chamar a função Serverless /api/search.
  // Em desenvolvimento (local) precisamos garantir que a proxy ou o endereço funcione.
  // Como estamos testando o front-end, podemos configurar um fallback para usar a chave env 
  // se o endpoint /api/search falhar por estarmos rodando só com o Vite local sem o Vercel CLI.
  
  try {
    const url = `/api/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data: TMDBResponse = await response.json();
      return data.results;
    }
  } catch (e) {
    console.warn("Vercel Serverless Function not found. Using fallback for local development.");
  }

  // Fallback para desenvolvimento local caso a Serverless Function não esteja rodando:
  const apiKey = import.meta.env.VITE_TMDB_API_KEY || localStorage.getItem('tmdb_api_key');
  if (!apiKey) {
    throw new Error('API Key do TMDB não configurada. Defina VITE_TMDB_API_KEY no .env (ou nas config da Vercel).');
  }

  const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
  
  const response = await fetch(tmdbUrl);
  if (!response.ok) {
    if (response.status === 401) {
       throw new Error('API Key inválida.');
    }
    throw new Error('Erro ao buscar filmes.');
  }

  const data: TMDBResponse = await response.json();
  return data.results;
};

export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=Sem+Capa';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
