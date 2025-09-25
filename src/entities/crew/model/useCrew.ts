import { useQuery } from "@tanstack/react-query";
import { fetchCrewById, fetchCrewMoviesById } from "../api/fetchApi";

export const useCrew = () => {
  const getCrewById = (id: string) =>
    useQuery({
      queryKey: ["crewKey", id],
      queryFn: () => fetchCrewById(id),
    });

  const getCrewMovieById = (id: string) =>
    useQuery({
      queryKey: ["crewKey", id, "crewMovie"],
      queryFn: () => fetchCrewMoviesById(id),
    });

  return { getCrewById, getCrewMovieById };
};
