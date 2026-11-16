import { api } from "@/shared/api";
import { getTrailerUrl } from "../model/trailer";
import { rankRecommendations } from "../model/recommendations";
import { normalizeTvSeries } from "../model/types";
import type {
  HomeMovieFeed, IEpisode, IGenre, IMovie, IMovieDetail, IMovieInfo, IMovieParams,
  IPagedResponse, ITvDetail, ITvSeries, MediaType,
} from "../model/types";

export const fetchMovies = async (params: IMovieParams, type: MediaType, signal: AbortSignal) => {
  if (type === "tv") {
    const { data } = await api.get<IPagedResponse<ITvSeries>>("discover/tv", { params, signal });
    return { ...data, results: data.results.map(normalizeTvSeries) };
  }
  const { data } = await api.get<IPagedResponse<IMovie>>("discover/movie", { params, signal });
  return data;
};

export const fetchHomeMovies = async (feed: HomeMovieFeed, signal: AbortSignal) => {
  const { data } = await api.get<IPagedResponse<IMovie>>(`/movie/${feed}`, { signal });
  return data;
};

export const fetchMovieById = async (id: string, type: MediaType, signal: AbortSignal) => {
  const config = {
    signal,
    params: {
      append_to_response: type === "tv" ? "videos,external_ids,content_ratings" : "videos,release_dates",
      include_video_language: "en,null",
    },
  };
  const { data } = await api.get<IMovieDetail | ITvDetail>(`/${type}/${id}`, config);
  const detail = "name" in data
    ? { ...data, title: data.name, release_date: data.first_air_date }
    : data;

  const language = detail.original_language;
  if (language && language !== "en" && !getTrailerUrl(detail.videos)) {
    try {
      const { data: videos } = await api.get<IMovieDetail["videos"]>(`/${type}/${id}/videos`, {
        signal,
        params: { language, include_video_language: language },
      });
      return { ...detail, videos };
    } catch {
      if (signal.aborted) signal.throwIfAborted();
    }
  }
  return detail;
};

export const fetchMovieInfo = async <T extends keyof IMovieInfo>(
  id: string, path: T, type: MediaType, signal: AbortSignal,
): Promise<IMovieInfo[T]> => {
  const { data } = await api.get<IMovieInfo[T]>(`/${type}/${id}/${path}`, { signal });
  return data;
};

const fetchRecommendedTitles = async (id: number, type: MediaType, signal: AbortSignal) => {
  if (type === "tv") {
    const { data } = await api.get<IPagedResponse<ITvSeries>>(`/tv/${id}/recommendations`, { signal });
    return data.results.map(normalizeTvSeries);
  }
  const { data } = await api.get<IPagedResponse<IMovie>>(`/movie/${id}/recommendations`, { signal });
  return data.results;
};

const fetchCollectionTitles = async (id: number, signal: AbortSignal) => {
  const { data } = await api.get<{ parts: IMovie[] }>(`/collection/${id}`, { signal });
  return data.parts;
};

export const fetchRecommendations = async (movie: IMovieDetail, type: MediaType, signal: AbortSignal) => {
  const collectionId = type === "movie" ? movie.belongs_to_collection?.id : undefined;
  const [recommendations, collection] = await Promise.allSettled([
    fetchRecommendedTitles(movie.id, type, signal),
    collectionId ? fetchCollectionTitles(collectionId, signal) : Promise.resolve([]),
  ]);
  signal.throwIfAborted();
  return rankRecommendations(
    movie,
    recommendations.status === "fulfilled" ? recommendations.value : [],
    collection.status === "fulfilled" ? collection.value : [],
  );
};

export const fetchGenres = async (type: MediaType, signal: AbortSignal) => {
  const { data } = await api.get<{ genres: IGenre[] }>(`/genre/${type}/list`, { signal });
  return data;
};

export const fetchSeason = async (id: number, season: number, signal: AbortSignal) => {
  const { data } = await api.get<{ episodes: IEpisode[] }>(`/tv/${id}/season/${season}`, { signal });
  return data;
};
