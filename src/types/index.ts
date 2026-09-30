export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviders {
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

export interface ExtendedMovieDetails extends Movie {
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: number;
  watch_providers?: WatchProviders;
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
