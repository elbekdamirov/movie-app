import type { IMovie, IMovieDetail } from "./types";

export const rankRecommendations = (movie: IMovieDetail, recommendations: IMovie[], collection: IMovie[]) => {
  const genres = new Set(movie.genres.map(({ id }) => id));
  const unique = new Map<number, IMovie>();
  const add = (candidate: IMovie) => {
    if (candidate.id !== movie.id && candidate.title && !candidate.adult && !unique.has(candidate.id)) {
      unique.set(candidate.id, candidate);
    }
  };

  collection.slice().sort((a, b) => b.popularity - a.popularity).forEach(add);
  recommendations
    .filter((candidate) => !genres.size || candidate.genre_ids?.some((id) => genres.has(id)))
    .forEach(add);

  return [...unique.values()];
};
