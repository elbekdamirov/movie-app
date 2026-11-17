import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchMovies, fetchMovieById, fetchMovieInfo, fetchGenres, fetchSeason, fetchRecommendations, fetchHomeMovies } from "../api/fetchApi";
import { fetchImdbRating, imdbRatingEnabled } from "../api/fetchImdbRating";
import { MAX_TMDB_PAGE } from "./types";
import type { HomeMovieFeed, IMovieDetail, IMovieInfo, IMovieParams, MediaType } from "./types";

export type HomeFeed = MediaType | HomeMovieFeed;

export const seasonQueryOptions = (id: number, season: number) =>
  queryOptions({
    queryKey: ["movieKey", "tv", id, "season", season],
    queryFn: ({ signal }) => fetchSeason(id, season, signal),
    retry: 0,
    staleTime: 1000 * 60 * 5,
  });

export const useSeason = (id: number, season: number) => useQuery(seasonQueryOptions(id, season));

export const useHomeFeed = (feed: HomeFeed = "movie") =>
  useInfiniteQuery({
    queryKey: ["movieKey", "feed", feed],
    queryFn: ({ pageParam, signal }) => feed === "movie" || feed === "tv"
      ? fetchMovies({ page: pageParam }, feed, signal)
      : fetchHomeMovies(feed, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.results.length && lastPage.page < Math.min(lastPage.total_pages, MAX_TMDB_PAGE)
        ? lastPage.page + 1
        : undefined,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

export const useMovie = () => {
  const getMovies = (params: IMovieParams = { page: 1 }, type: MediaType = "movie", enabled = true) =>
    useQuery({
      queryKey: ["movieKey", type, "discover", params],
      queryFn: ({ signal }) => fetchMovies(params, type, signal),
      enabled,
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
    });

  const getMovieById = (id: string, type: MediaType = "movie") =>
    useQuery({
      queryKey: ["movieKey", type, id],
      queryFn: ({ signal }) => fetchMovieById(id, type, signal),
      enabled: /^[1-9]\d*$/.test(id),
      retry: 0,
    });

  const getMovieInfo = <T extends keyof IMovieInfo>(id: string, path: T, type: MediaType = "movie") =>
    useQuery({
      queryKey: ["movieKey", type, id, path],
      queryFn: ({ signal }) => fetchMovieInfo(id, path, type, signal),
    });

  const getGenres = (type: MediaType = "movie", enabled = true) =>
    useQuery({
      queryKey: ["genres", type],
      queryFn: ({ signal }) => fetchGenres(type, signal),
      enabled,
      staleTime: 1000 * 60 * 60,
    });

  const getRecommendations = (movie: IMovieDetail, type: MediaType) =>
    useQuery({
      queryKey: ["movieKey", type, movie.id, "recommendations"],
      queryFn: ({ signal }) => fetchRecommendations(movie, type, signal),
      staleTime: 1000 * 60 * 10,
      retry: 0,
    });

  const getImdbRating = (imdbId: string) =>
    useQuery({
      queryKey: ["imdbRating", imdbId],
      queryFn: ({ signal }) => fetchImdbRating(imdbId, signal),
      enabled: imdbRatingEnabled && !!imdbId,
      staleTime: 1000 * 60 * 60 * 12,
      retry: 0,
    });

  return { getMovies, getMovieById, getMovieInfo, getGenres, getRecommendations, getImdbRating };
};
