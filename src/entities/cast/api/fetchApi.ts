import { api } from "@/shared/api";
import type { MediaType } from "@/entities/movie";

interface ICredit {
  credit_id: string;
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  job?: string;
}

export const fetchCastById = async (id: string, mediaType: MediaType, signal: AbortSignal) => {
  const { data } = await api.get<{ cast: ICredit[]; crew: ICredit[] }>(`/${mediaType}/${id}/credits`, { signal });
  return data;
};
