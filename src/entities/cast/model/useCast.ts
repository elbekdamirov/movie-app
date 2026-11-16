import { useQuery } from "@tanstack/react-query";
import type { MediaType } from "@/entities/movie";
import { fetchCastById } from "../api/fetchApi";

export const useCast = () => {
  const getCasts = (id: string, mediaType: MediaType) =>
    useQuery({
      queryKey: ["castKey", mediaType, id],
      queryFn: ({ signal }) => fetchCastById(id, mediaType, signal),
      retry: 0,
    });

  return { getCasts };
};
