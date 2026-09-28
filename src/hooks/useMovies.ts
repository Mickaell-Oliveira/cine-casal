import { useState, useEffect } from 'react';
import type { WatchlistMovie, WatchedMovie, Movie } from '../types';
import { supabase } from '../services/supabase';

export const useMovies = () => {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [watched, setWatched] = useState<WatchedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('added_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const _watchlist: WatchlistMovie[] = [];
        const _watched: WatchedMovie[] = [];

        data.forEach((row) => {
          const movieData = {
            id: row.id,
            title: row.title,
            original_title: row.original_title,
            overview: row.overview,
            poster_path: row.poster_path,
            release_date: row.release_date,
          };

          if (row.watched) {
            _watched.push({
              ...movieData,
              watchedAt: row.watched_at,
              ratingHe: row.rating_he,
              ratingShe: row.rating_she,
              comment: row.comment,
            });
          } else {
            _watchlist.push({
              ...movieData,
              addedAt: row.added_at,
            });
          }
        });

        setWatchlist(_watchlist);
        setWatched(_watched);
      }
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    
    // Configurar o listener para atualizações em tempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'movies',
        },
        () => {
          fetchMovies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addToWatchlist = async (movie: Movie) => {
    if (!watchlist.some((m) => m.id === movie.id) && !watched.some((m) => m.id === movie.id)) {
      
      // Atualização otimista
      const newWatchlistMovie: WatchlistMovie = { ...movie, addedAt: new Date().toISOString() };
      setWatchlist([newWatchlistMovie, ...watchlist]);

      const { error } = await supabase.from('movies').insert([
        {
          id: movie.id,
          title: movie.title,
          original_title: movie.original_title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          watched: false,
        },
      ]);

      if (error) {
        console.error('Error adding movie:', error);
        // Reverter atualização otimista
        setWatchlist(watchlist.filter(m => m.id !== movie.id));
      }
    }
  };

  const removeFromWatchlist = async (id: number) => {
    const movieToRestore = watchlist.find(m => m.id === id);
    setWatchlist(watchlist.filter((m) => m.id !== id)); // Atualização otimista

    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (error && movieToRestore) {
      console.error('Error removing movie:', error);
      setWatchlist([...watchlist, movieToRestore]);
    }
  };

  const markAsWatched = async (id: number, ratingHe: number, ratingShe: number, comment?: string, customWatchedAt?: string) => {
    const movie = watchlist.find((m) => m.id === id);
    if (movie) {
      const watchedAt = customWatchedAt || new Date().toISOString();
      
      // Atualização otimista
      setWatchlist(watchlist.filter((m) => m.id !== id));
      const newWatchedMovie: WatchedMovie = {
        ...movie,
        watchedAt,
        ratingHe,
        ratingShe,
        comment,
      };
      setWatched([newWatchedMovie, ...watched]);

      const { error } = await supabase
        .from('movies')
        .update({
          watched: true,
          watched_at: watchedAt,
          rating_he: ratingHe,
          rating_she: ratingShe,
          comment: comment || null,
        })
        .eq('id', id);

      if (error) {
        console.error('Error marking as watched:', error);
        // O ideal seria reverter, mas uma atualização da tela acontecerá via websocket
      }
    }
  };

  const removeFromWatched = async (id: number) => {
    const movieToRestore = watched.find(m => m.id === id);
    setWatched(watched.filter((m) => m.id !== id)); // Atualização otimista

    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (error && movieToRestore) {
      console.error('Error removing watched movie:', error);
      setWatched([...watched, movieToRestore]);
    }
  };

  return {
    watchlist,
    watched,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    removeFromWatched,
  };
};
