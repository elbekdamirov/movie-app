import { useQuery } from "@tanstack/react-query";
import { fetchMovieBySearch, type SearchParams } from "../api/fetchApi";

export const useSearchMovie = () => {
  const getMovieBySearch = (params: SearchParams, enabled: boolean) =>
    useQuery({
      queryKey: ["searchMovieKey", params],
      queryFn: ({ signal }) => fetchMovieBySearch(params, signal),
      enabled,
      retry: 0,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    });

  return { getMovieBySearch };
};
