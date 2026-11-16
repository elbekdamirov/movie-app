import type { IMovieDetail } from "./types";

const languageRegions: Record<string, string> = { en: "US", ru: "RU", uz: "UZ" };

export const getImdbId = (movie: IMovieDetail) => {
  const id = movie.external_ids?.imdb_id || movie.imdb_id;
  return id && /^tt\d+$/.test(id) ? id : undefined;
};

export const getAgeCertification = (movie: IMovieDetail, locale = "en") => {
  const [language, region] = locale.split("-");
  const preferred = region?.toUpperCase() || languageRegions[language] || "US";

  const certifications = movie.content_ratings
    ? movie.content_ratings.results.map((item) => ({ country: item.iso_3166_1, rating: item.rating?.trim() }))
    : movie.release_dates?.results.map((item) => {
        const releases = item.release_dates.filter((release) => release.certification?.trim());
        const rating = (releases.find((release) => release.type === 3) ?? releases[0])?.certification.trim();
        return { country: item.iso_3166_1, rating };
      }) ?? [];

  const available = certifications.filter((item) => item.rating);
  return available.find((item) => item.country === preferred)
    ?? available.find((item) => item.country === "US");
};
