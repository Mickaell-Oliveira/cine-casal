import type { TMDBResponse, Movie } from '../types';

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];

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

  const apiKey = import.meta.env.VITE_TMDB_API_KEY || localStorage.getItem('tmdb_api_key');
  if (!apiKey) {
    throw new Error('API Key do TMDB não configurada.');
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

export const getMovieDetails = async (id: number) => {
  try {
    const url = `/api/movie?id=${id}`;
    const response = await fetch(url);
    
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn("Vercel Serverless Function not found. Using fallback for local development.");
  }

  const apiKey = import.meta.env.VITE_TMDB_API_KEY || localStorage.getItem('tmdb_api_key');
  if (!apiKey) {
    throw new Error('API Key do TMDB não configurada.');
  }

  const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`;
  const providersUrl = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`;

  const [detailsRes, providersRes] = await Promise.all([
    fetch(detailsUrl),
    fetch(providersUrl)
  ]);

  if (!detailsRes.ok) throw new Error('Erro ao buscar detalhes.');

  const details = await detailsRes.json();
  let watch_providers = undefined;

  if (providersRes.ok) {
    const providersData = await providersRes.json();
    watch_providers = providersData.results?.BR;
  }

  return {
    ...details,
    watch_providers
  };
};

export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=Sem+Capa';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
