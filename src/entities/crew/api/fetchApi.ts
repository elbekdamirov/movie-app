import { api } from "@/shared/api";

export const fetchCrewById = async (id: string) => {
  const response = await api.get(`/person/${id}`);
  return response.data;
};

export const fetchCrewMoviesById = async (id: string) => {
  const response = await api.get(`/person/${id}/movie_credits`);
  return response.data;
};
