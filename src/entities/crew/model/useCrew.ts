import { useQuery } from "@tanstack/react-query";
import { fetchCrewById, fetchCrewCreditsById } from "../api/fetchApi";

export const useCrew = () => {
  const getCrewById = (id: string) =>
    useQuery({
      queryKey: ["crewKey", id],
      queryFn: ({ signal }) => fetchCrewById(id, signal),
      enabled: /^[1-9]\d*$/.test(id),
      staleTime: 1000 * 60 * 5,
      retry: 0,
    });

  const getCrewCreditsById = (id: string) =>
    useQuery({
      queryKey: ["crewKey", id, "combinedCredits"],
      queryFn: ({ signal }) => fetchCrewCreditsById(id, signal),
      enabled: /^[1-9]\d*$/.test(id),
      staleTime: 1000 * 60 * 5,
      retry: 0,
    });

  return { getCrewById, getCrewCreditsById };
};
