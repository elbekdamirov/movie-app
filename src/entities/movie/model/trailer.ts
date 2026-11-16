import type { IMovieDetail } from "./types";

export const getTrailerUrl = (videos?: IMovieDetail["videos"]) => {
  const trailers = videos?.results.flatMap(({ site, type, key, official }) => {
    if (type !== "Trailer") return [];
    if (site === "YouTube" && /^[\w-]{11}$/.test(key)) {
      return [{ url: `https://www.youtube-nocookie.com/embed/${key}`, official }];
    }
    if (site === "Vimeo" && /^\d+$/.test(key)) {
      return [{ url: `https://player.vimeo.com/video/${key}`, official }];
    }
    return [];
  }) ?? [];

  return (trailers.find((trailer) => trailer.official) ?? trailers[0])?.url;
};
