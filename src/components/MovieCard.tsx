import { Star, Plus, Check, Trash2 } from 'lucide-react';
import type { Movie, WatchedMovie } from '../types';
import { getImageUrl } from '../services/api';

interface MovieCardProps {
  movie: Movie;
  type: 'search' | 'watchlist' | 'watched';
  isAdmin: boolean;
  onAdd?: (movie: Movie) => void;
  onRemoveWatchlist?: (id: number) => void;
  onRemoveWatched?: (id: number) => void;
  onMarkWatched?: (id: number) => void;
}

export function MovieCard({
  movie,
  type,
  isAdmin,
  onAdd,
  onRemoveWatchlist,
  onRemoveWatched,
  onMarkWatched,
}: MovieCardProps) {
  const isSearch = type === 'search';
  const isWatchlist = type === 'watchlist';
  const isWatched = type === 'watched';
  
  const watchedMovie = movie as WatchedMovie;

  return (
    <div className="group bg-cinema-800 rounded-xl overflow-hidden shadow-lg border border-cinema-700 hover:border-cinema-500 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-900 via-transparent to-transparent opacity-80" />
        
        {/* Actions Overlay */}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-2 md:group-hover:translate-x-0">
            {isSearch && onAdd && (
            <button
              onClick={() => onAdd(movie)}
              className="p-2 bg-accent hover:bg-red-700 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors"
              title="Adicionar à lista"
            >
              <Plus size={20} />
            </button>
          )}
          
          {isWatchlist && (
            <>
              <button
                onClick={() => onMarkWatched && onMarkWatched(movie.id)}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors"
                title="Marcar como assistido"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => onRemoveWatchlist && onRemoveWatchlist(movie.id)}
                className="p-2 bg-cinema-900/80 hover:bg-red-900 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors"
                title="Remover"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}

          {isWatched && onRemoveWatched && (
            <button
              onClick={() => onRemoveWatched(movie.id)}
              className="p-2 bg-cinema-900/80 hover:bg-red-900 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors"
              title="Remover"
            >
              <Trash2 size={20} />
            </button>
          )}
          </div>
        )}

        {/* Release Year Badge */}
        {movie.release_date && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-medium text-gray-200">
            {new Date(movie.release_date).getFullYear()}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-white text-lg line-clamp-1 mb-1" title={movie.title}>
          {movie.title}
        </h3>
        {movie.original_title !== movie.title && (
          <p className="text-xs text-gray-400 mb-2 line-clamp-1" title={movie.original_title}>
            {movie.original_title}
          </p>
        )}
        
        {isWatched ? (
          <div className="mt-auto space-y-3 pt-3 border-t border-cinema-700">
            <div className="flex justify-between items-center bg-cinema-900/50 p-2 rounded-lg">
              <span className="text-xs font-medium text-gray-400">Avaliação Dele</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold text-white">{watchedMovie.ratingHe}/5</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-cinema-900/50 p-2 rounded-lg">
              <span className="text-xs font-medium text-gray-400">Avaliação Dela</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold text-white">{watchedMovie.ratingShe}/5</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 line-clamp-3 mt-auto">
            {movie.overview || 'Nenhuma sinopse disponível para este filme.'}
          </p>
        )}
      </div>
    </div>
  );
}
