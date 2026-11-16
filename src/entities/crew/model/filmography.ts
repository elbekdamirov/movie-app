import { getMediaPath, normalizeTvSeries, type IMovie } from "@/entities/movie";
import type { PersonCredit } from "./types";

interface RankedCredit {
  movie: IMovie & { credit?: string };
  isSelfAppearance: boolean;
  score: number;
}

const compareCredits = (a: RankedCredit, b: RankedCredit) =>
  Number(a.isSelfAppearance) - Number(b.isSelfAppearance) || b.score - a.score;

export const getFilmography = (credits: PersonCredit[]) => {
  const titles = new Map<string, RankedCredit>();
  for (const item of credits) {
    const movie = item.media_type === "tv" ? normalizeTvSeries(item) : item;
    if (!movie?.title || !movie.id) continue;
    const key = getMediaPath(movie);
    const existing = titles.get(key);
    const credit = item.character || item.job;
    const isSelfAppearance = /^(?:self|himself|herself|themself|themselves)\b/i.test(credit?.trim() ?? "")
      || (item.media_type === "tv" && item.genre_ids?.includes(10767) === true);
    const score = Math.log1p(item.popularity ?? 0)
      + Math.log1p(item.vote_count ?? 0)
      + 1.4 * Math.log1p(item.episode_count ?? 0);
    const entry = { movie: { ...movie, credit }, isSelfAppearance, score };

    if (!existing || compareCredits(entry, existing) < 0 || (!existing.movie.credit && credit)) {
      titles.set(key, entry);
    }
  }

  return [...titles.values()].sort(compareCredits).map(({ movie }) => movie);
};
