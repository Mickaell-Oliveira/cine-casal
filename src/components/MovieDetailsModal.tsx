import { useState, useEffect } from 'react';
import { X, Star, Clock, Calendar } from 'lucide-react';
import type { ExtendedMovieDetails, Movie } from '../types';
import { getMovieDetails, getImageUrl } from '../services/api';

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const [details, setDetails] = useState<ExtendedMovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      setLoading(true);
      getMovieDetails(movie.id)
        .then((data) => setDetails(data))
        .catch((err) => console.error("Error fetching details:", err))
        .finally(() => setLoading(false));
    } else {
      setDetails(null);
    }
  }, [isOpen, movie]);

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-cinema-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-cinema-700 animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row relative max-h-[90vh]">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 bg-cinema-900/80 rounded-full z-10"
        >
          <X size={20} />
        </button>

        {/* Movie Poster */}
        <div className="md:w-2/5 relative h-64 md:h-auto shrink-0">
          <img
            src={getImageUrl(movie.poster_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-cinema-800 via-transparent to-transparent md:from-transparent md:to-cinema-800" />
        </div>

        {/* Content */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
               <div className="animate-spin rounded-full h-10 w-10 border-4 border-accent border-t-transparent"></div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">{details?.title || movie.title}</h2>
              {movie.original_title !== movie.title && (
                <p className="text-sm text-gray-400 mb-4 italic">{movie.original_title}</p>
              )}

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-300">
                {details?.vote_average ? (
                  <div className="flex items-center gap-1 bg-cinema-900/60 px-3 py-1.5 rounded-full border border-cinema-700">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-white">{details.vote_average.toFixed(1)}</span>
                  </div>
                ) : null}
                
                {movie.release_date && (
                  <div className="flex items-center gap-1 bg-cinema-900/60 px-3 py-1.5 rounded-full border border-cinema-700">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}

                {details?.runtime ? (
                  <div className="flex items-center gap-1 bg-cinema-900/60 px-3 py-1.5 rounded-full border border-cinema-700">
                    <Clock size={16} className="text-gray-400" />
                    <span>{details.runtime} min</span>
                  </div>
                ) : null}
              </div>

              {details?.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.genres.map(g => (
                    <span key={g.id} className="text-xs bg-cinema-700/50 text-gray-300 px-2 py-1 rounded">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Sinopse</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {details?.overview || movie.overview || 'Nenhuma sinopse disponível para este filme.'}
                </p>
              </div>

              {/* Where to Watch */}
              <div className="mt-auto pt-6 border-t border-cinema-700">
                <h3 className="text-lg font-semibold text-white mb-4">Onde assistir (Streaming)</h3>
                
                {details?.watch_providers?.flatrate && details.watch_providers.flatrate.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {details.watch_providers.flatrate.map(provider => (
                      <div key={provider.provider_id} className="relative group cursor-help">
                        <img 
                          src={getImageUrl(provider.logo_path, 'w200')} 
                          alt={provider.provider_name}
                          className="w-12 h-12 rounded-xl shadow-lg border border-cinema-600 group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {provider.provider_name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-cinema-900/30 p-4 rounded-lg border border-cinema-700/50">
                    No momento, este filme não está disponível em nenhum serviço de streaming no Brasil.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
