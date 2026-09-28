import { useState, useEffect } from 'react';
import type { WatchlistMovie, WatchedMovie, Movie } from '../types';

export const useMovies = () => {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [watched, setWatched] = useState<WatchedMovie[]>([]);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('cinecasal_watchlist');
    const savedWatched = localStorage.getItem('cinecasal_watched');

    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedWatched) setWatched(JSON.parse(savedWatched));
  }, []);

  useEffect(() => {
    localStorage.setItem('cinecasal_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cinecasal_watched', JSON.stringify(watched));
  }, [watched]);

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.some((m) => m.id === movie.id) && !watched.some((m) => m.id === movie.id)) {
      setWatchlist([...watchlist, { ...movie, addedAt: new Date().toISOString() }]);
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(watchlist.filter((m) => m.id !== id));
  };

  const markAsWatched = (id: number, ratingHe: number, ratingShe: number, comment?: string) => {
    const movie = watchlist.find((m) => m.id === id);
    if (movie) {
      setWatchlist(watchlist.filter((m) => m.id !== id));
      setWatched([
        ...watched,
        {
          ...movie,
          watchedAt: new Date().toISOString(),
          ratingHe,
          ratingShe,
          comment,
        },
      ]);
    }
  };

  const removeFromWatched = (id: number) => {
    setWatched(watched.filter((m) => m.id !== id));
  };

  return {
    watchlist,
    watched,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    removeFromWatched,
  };
};
