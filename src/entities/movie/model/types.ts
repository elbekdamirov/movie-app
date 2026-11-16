export type MediaType = "movie" | "tv";
export type HomeMovieFeed = "now_playing" | "top_rated" | "upcoming";

interface MediaFields {
  adult?: boolean;
  backdrop_path: string | null;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface IMovie extends MediaFields {
  genre_ids: number[];
  media_type?: MediaType;
  release_date: string;
  title: string;
}

export interface ITvSeries extends MediaFields {
  genre_ids: number[];
  first_air_date: string;
  name: string;
}

export interface ISeason {
  air_date: string | null;
  episode_count: number;
  name: string;
  season_number: number;
}

export interface IEpisode {
  id: number;
  air_date: string | null;
  episode_number: number;
  name: string;
  overview: string;
  runtime: number | null;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface IMovieDetail extends MediaFields {
  title: string;
  release_date: string;
  genres: IGenre[];
  tagline: string;
  homepage: string | null;
  status: string;
  runtime?: number | null;
  budget?: number;
  belongs_to_collection?: { id: number } | null;
  imdb_id?: string | null;
  external_ids?: { imdb_id: string | null };
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  release_dates?: {
    results: { iso_3166_1: string; release_dates: { certification: string; type: number }[] }[];
  };
  seasons?: ISeason[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      official: boolean;
      iso_639_1: string;
    }[];
  };
}

export interface ITvDetail extends Omit<IMovieDetail, "title" | "release_date"> {
  name: string;
  first_air_date: string;
}

export interface IPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface IReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    avatar_path: string | null;
    rating?: number;
  };
}

export interface IMovieInfo {
  images: {
    backdrops: { file_path: string }[];
    logos?: { file_path: string; iso_639_1: string | null; width: number; height: number }[];
  };
  reviews: IPagedResponse<IReview>;
}

export interface IMovieParams {
  page: number;
  sort_by?: string;
  with_genres?: string;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
}

export interface IGenre {
  id: number;
  name: string;
}

export const MAX_TMDB_PAGE = 500;

export const normalizeTvSeries = (series: ITvSeries): IMovie => ({
  ...series,
  title: series.name,
  release_date: series.first_air_date,
  media_type: "tv",
});

export const getMediaPath = (movie: Pick<IMovie, "media_type" | "id">) =>
  `/${movie.media_type ?? "movie"}/${movie.id}`;
