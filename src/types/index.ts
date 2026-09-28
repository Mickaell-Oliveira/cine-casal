export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
}

export interface WatchlistMovie extends Movie {
  addedAt: string;
}

export interface WatchedMovie extends Movie {
  watchedAt: string;
  ratingHe: number; // Avaliação Dele
  ratingShe: number; // Avaliação Dela
  comment?: string;
}

export interface TMDBResponse {
  results: Movie[];
}
