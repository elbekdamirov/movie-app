import { useQuery } from "@tanstack/react-query";
import { fetchCastById } from "../api/fetchApi";

export const useCast = () => {
  const getCasts = (id: string) =>
    useQuery({
      queryKey: ["castKey", id],
      queryFn: () => fetchCastById(id),
    });

  return { getCasts };
};
