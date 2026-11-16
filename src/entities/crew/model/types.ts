import type { IMovie, ITvSeries } from "@/entities/movie";

export interface IPersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for?: { title?: string; name?: string }[];
}

export interface IPerson extends IPersonSummary {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  imdb_id: string | null;
  homepage: string | null;
  also_known_as: string[];
}

interface CreditRole {
  character?: string;
  job?: string;
  episode_count?: number;
}

export type PersonCredit = CreditRole & (
  | (IMovie & { media_type: "movie" })
  | (ITvSeries & { media_type: "tv" })
);

export interface ICombinedCredits {
  cast: PersonCredit[];
  crew: PersonCredit[];
}
