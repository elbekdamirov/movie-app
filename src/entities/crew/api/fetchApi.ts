import { api } from "@/shared/api";
import type { ICombinedCredits, IPerson } from "../model/types";

export const fetchCrewById = async (id: string, signal: AbortSignal) => {
  const { data } = await api.get<IPerson>(`/person/${id}`, { signal });
  return data;
};

export const fetchCrewCreditsById = async (id: string, signal: AbortSignal) => {
  const { data } = await api.get<ICombinedCredits>(`/person/${id}/combined_credits`, { signal });
  return data;
};
