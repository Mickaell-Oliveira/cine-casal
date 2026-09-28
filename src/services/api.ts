import type { TMDBResponse, Movie } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';

export const getApiKey = (): string | null => {
  return localStorage.getItem('tmdb_api_key') || import.meta.env.VITE_TMDB_API_KEY || null;
};

export const setApiKey = (key: string) => {
  localStorage.setItem('tmdb_api_key', key);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API Key do TMDB não configurada.');
  }

  if (!query.trim()) return [];

  const url = `${BASE_URL}/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
  
  const response = await fetch(url);
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
