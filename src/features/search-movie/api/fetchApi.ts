import type { IPersonSummary } from "@/entities/crew";
import { normalizeTvSeries, type IMovie, type IPagedResponse, type ITvSeries, type MediaType } from "@/entities/movie/model/types";
import { api } from "@/shared/api";

export type SearchFilter = "multi" | MediaType | "person";
type SearchRequest = { query: string; page: number };
export type SearchParams = SearchRequest & { type: SearchFilter };

type TitleResult = IMovie & { media_type: MediaType };
export type SearchResult = TitleResult | (IPersonSummary & { media_type: "person" });

const requestSearch = async <T>(type: Exclude<SearchFilter, "multi">, params: SearchRequest, signal: AbortSignal) => {
  const { data } = await api.get<IPagedResponse<T>>(`/search/${type}`, {
    params: { ...params, include_adult: false },
    signal,
  });
  return data;
};

const searchTitles = async (type: MediaType, params: SearchRequest, signal: AbortSignal): Promise<IPagedResponse<TitleResult>> => {
  if (type === "tv") {
    const data = await requestSearch<ITvSeries>(type, params, signal);
    return { ...data, results: data.results.map((item) => ({ ...normalizeTvSeries(item), media_type: "tv" })) };
  }
  const data = await requestSearch<IMovie>(type, params, signal);
  return { ...data, results: data.results.map((item) => ({ ...item, media_type: "movie" })) };
};

const searchPeople = async (params: SearchRequest, signal: AbortSignal): Promise<IPagedResponse<SearchResult>> => {
  const data = await requestSearch<IPersonSummary>("person", params, signal);
  return { ...data, results: data.results.map((item) => ({ ...item, media_type: "person" })) };
};

const mergeTitles = (movies: TitleResult[], shows: TitleResult[], query: string) => {
  const results: TitleResult[] = [];
  for (let index = 0; index < Math.max(movies.length, shows.length); index++) {
    if (movies[index]) results.push(movies[index]);
    if (shows[index]) results.push(shows[index]);
  }

  const target = query.normalize("NFKC").toLowerCase();
  const priority = ({ title }: TitleResult) => {
    const name = title.normalize("NFKC").toLowerCase();
    if (name === target) return 2;
    return Number(name.startsWith(target));
  };
  return results.sort((a, b) => priority(b) - priority(a));
};

export const fetchMovieBySearch = async ({ type, ...params }: SearchParams, signal: AbortSignal): Promise<IPagedResponse<SearchResult>> => {
  if (type === "person") return searchPeople(params, signal);
  if (type !== "multi") return searchTitles(type, params, signal);

  const [movies, shows] = await Promise.all([
    searchTitles("movie", params, signal),
    searchTitles("tv", params, signal),
  ]);
  const total = movies.total_results + shows.total_results;
  if (!total) return searchPeople(params, signal);

  return {
    page: params.page,
    total_pages: Math.max(movies.total_pages, shows.total_pages),
    total_results: total,
    results: mergeTitles(movies.results, shows.results, params.query),
  };
};
