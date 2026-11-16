import { getMediaPath } from "@/entities/movie/model/types";
import type { SearchFilter, SearchResult } from "../api/fetchApi";

export const getSearchFilter = (value: string | null): SearchFilter =>
  value === "movie" || value === "tv" || value === "person" ? value : "multi";

export const getSearchPath = (query: string, type: SearchFilter) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (type !== "multi") params.set("type", type);
  return params.size ? `/search?${params}` : "/search";
};

export const getSearchResultPath = (result: SearchResult) =>
  result.media_type === "person" ? `/crew/${result.id}` : getMediaPath(result);
