import { api } from "@/shared/api";

export const fetchCastById = async (id: string) => {
  const response = await api.get(`/movie/${id}/credits`);
  return response.data;
};
