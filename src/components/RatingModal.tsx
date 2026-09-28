import { useState } from 'react';
import { X, Star } from 'lucide-react';
import type { Movie } from '../types';
import { getImageUrl } from '../services/api';

interface RatingModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, ratingHe: number, ratingShe: number, comment?: string) => void;
}

export function RatingModal({ movie, isOpen, onClose, onSave }: RatingModalProps) {
  const [ratingHe, setRatingHe] = useState(0);
  const [ratingShe, setRatingShe] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen || !movie) return null;

  const handleSave = () => {
    onSave(movie.id, ratingHe, ratingShe, comment);
    // Reset state
    setRatingHe(0);
    setRatingShe(0);
    setComment('');
    onClose();
  };

  const renderStars = (rating: number, setRating: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="p-1 transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={28}
              className={`${
                star <= rating
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-500 hover:text-yellow-500/50'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-cinema-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-cinema-700 animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row">
        
        {/* Movie Poster (Hidden on small screens) */}
        <div className="hidden md:block w-1/3 relative">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cinema-800" />
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 line-clamp-2">{movie.title}</h2>
              <p className="text-sm text-gray-400">Avalie este filme</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 bg-cinema-900 rounded-full">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="bg-cinema-900/50 p-4 rounded-xl border border-cinema-700">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Avaliação Dele
              </label>
              {renderStars(ratingHe, setRatingHe)}
            </div>

            <div className="bg-cinema-900/50 p-4 rounded-xl border border-cinema-700">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Avaliação Dela
              </label>
              {renderStars(ratingShe, setRatingShe)}
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                Comentário do casal (opcional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full bg-cinema-900 border border-cinema-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                placeholder="O que acharam do filme?"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-cinema-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={ratingHe === 0 || ratingShe === 0}
              className="px-5 py-2.5 rounded-lg font-medium bg-accent text-white hover:bg-red-700 shadow-lg shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
