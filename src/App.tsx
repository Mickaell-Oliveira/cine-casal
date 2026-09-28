import { useState, useEffect } from 'react';
import { Search, Popcorn, Film, Heart } from 'lucide-react';
import { Header } from './components/Header';
import { MovieCard } from './components/MovieCard';
import { RatingModal } from './components/RatingModal';
import { LoginModal } from './components/LoginModal';
import { useMovies } from './hooks/useMovies';
import { useAuth } from './hooks/useAuth';
import { searchMovies } from './services/api';
import type { Movie } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'watched'>('watchlist');
  
  const [ratingModalMovie, setRatingModalMovie] = useState<Movie | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { isAdmin, login, logout } = useAuth();

  // Configurações e loading
  const {
    watchlist,
    watched,
    loading,
    error: supabaseError,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    removeFromWatched,
  } = useMovies();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        setError(null);
        try {
          const results = await searchMovies(searchQuery);
          setSearchResults(results);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddMovie = (movie: Movie) => {
    addToWatchlist(movie);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Stats calculation
  const totalWatched = watched.length;
  const avgHe = totalWatched > 0 
    ? (watched.reduce((acc, m) => acc + m.ratingHe, 0) / totalWatched).toFixed(1)
    : '0.0';
  const avgShe = totalWatched > 0 
    ? (watched.reduce((acc, m) => acc + m.ratingShe, 0) / totalWatched).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-cinema-900 pb-20">
      <Header 
        isAdmin={isAdmin} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogoutClick={logout} 
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={login} 
      />
      
      <RatingModal
        movie={ratingModalMovie}
        isOpen={!!ratingModalMovie}
        onClose={() => setRatingModalMovie(null)}
        onSave={markAsWatched}
      />

      {loading && (
        <div className="fixed inset-0 bg-cinema-900/80 backdrop-blur-sm z-[100] flex items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
        </div>
      )}

      {supabaseError && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 mx-4 mt-4 rounded-xl text-center">
          Erro ao carregar filmes do banco de dados: {supabaseError}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 pt-8">
        {/* Search Section */}
        <section className="mb-12 relative z-40">
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar filmes para assistir..."
                className="w-full bg-cinema-800 border-2 border-cinema-700 rounded-full py-4 pl-12 pr-4 text-white text-lg shadow-lg focus:outline-none focus:ring-0 focus:border-accent transition-all placeholder:text-gray-500"
              />
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim().length > 2 && (
              <div className="absolute mt-2 w-full bg-cinema-800 border border-cinema-700 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
                {isSearching ? (
                  <div className="p-8 text-center text-gray-400">Buscando filmes...</div>
                ) : error ? (
                  <div className="p-8 text-center text-red-400">{error}</div>
                ) : searchResults.length > 0 ? (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {searchResults.slice(0, 8).map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        type="search"
                        isAdmin={isAdmin}
                        onAdd={handleAddMovie}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">Nenhum filme encontrado.</div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-cinema-800 p-1 rounded-full flex gap-1 border border-cinema-700">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'watchlist'
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film size={18} />
              <span>Quero Ver ({watchlist.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('watched')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'watched'
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Popcorn size={18} />
              <span>Assistidos ({watched.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'watchlist' && (
          <section className="animate-in fade-in duration-300">
            {watchlist.length === 0 ? (
              <div className="text-center py-20">
                <Film size={48} className="mx-auto text-cinema-700 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">Nenhum filme na lista</h3>
                <p className="text-gray-500 mt-2">Busque por filmes e adicione-os aqui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {watchlist.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    type="watchlist"
                    isAdmin={isAdmin}
                    onRemoveWatchlist={removeFromWatchlist}
                    onMarkWatched={(id) => setRatingModalMovie(watchlist.find(m => m.id === id) || null)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'watched' && (
          <section className="animate-in fade-in duration-300">
            {watched.length > 0 && (
              <div className="bg-cinema-800 rounded-2xl p-6 mb-8 border border-cinema-700 flex flex-wrap gap-8 justify-around items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Filmes Assistidos</p>
                  <p className="text-4xl font-bold text-white">{totalWatched}</p>
                </div>
                <div className="w-px h-12 bg-cinema-700 hidden sm:block"></div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Média Dele</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-white">{avgHe}</span>
                    <Heart size={20} className="text-accent fill-accent" />
                  </div>
                </div>
                <div className="w-px h-12 bg-cinema-700 hidden sm:block"></div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Média Dela</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-white">{avgShe}</span>
                    <Heart size={20} className="text-accent fill-accent" />
                  </div>
                </div>
              </div>
            )}
            
            {watched.length === 0 ? (
              <div className="text-center py-20">
                <Popcorn size={48} className="mx-auto text-cinema-700 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">Nenhum filme assistido</h3>
                <p className="text-gray-500 mt-2">Marque os filmes da sua lista como assistidos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {watched.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    type="watched"
                    isAdmin={isAdmin}
                    onRemoveWatched={removeFromWatched}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
