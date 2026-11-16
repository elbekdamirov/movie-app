import { memo, useState, type ReactNode } from "react";
import { createImageUrl, getReleaseYear } from "@/shared/utils";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import type { IMovieDetail, IMovieInfo, MediaType } from "../../model/types";
import { getAgeCertification, getImdbId } from "../../model/parentalGuide";
import { useMovie } from "../../model/useMovie";

interface Props {
  movie: IMovieDetail;
  type: MediaType;
  logos?: IMovieInfo["images"]["logos"];
  actions: ReactNode;
}

export const MovieInfo = memo(({ movie, type, logos, actions }: Props) => {
  const { t, i18n } = useTranslation();
  const [failedLogo, setFailedLogo] = useState<string>();
  const language = i18n.resolvedLanguage?.split("-")[0];
  const titleLogos = logos?.filter((image) => image.width / image.height >= 1.25) ?? [];
  const logo = titleLogos.find((image) => image.iso_639_1 === language)
    ?? titleLogos.find((image) => image.iso_639_1 === "en")
    ?? titleLogos.find((image) => !image.iso_639_1);
  const showLogo = logo && failedLogo !== logo.file_path;
  const backdrop = movie.backdrop_path || movie.poster_path;
  const year = getReleaseYear(movie.release_date);
  const votes = new Intl.NumberFormat(i18n.resolvedLanguage).format(movie.vote_count);
  const imdbId = getImdbId(movie);
  const imdbUrl = imdbId ? `https://www.imdb.com/title/${imdbId}/` : undefined;
  const certification = getAgeCertification(movie, i18n.resolvedLanguage);
  const { getImdbRating } = useMovie();
  const { data: imdbRating } = getImdbRating(imdbId ?? "");

  return (
    <section aria-labelledby="detail-title">
      <div className="detail-hero">
        {backdrop && (
          <img
            className="hero-image"
            src={createImageUrl(backdrop, "w1280")}
            srcSet={`${createImageUrl(backdrop, "w780")} 780w, ${createImageUrl(backdrop, "w1280")} 1280w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
          />
        )}
        <div className="container detail-summary">
          <div className="detail-hero-copy">
            <h1 id="detail-title" aria-label={showLogo ? movie.title : undefined}>
              {showLogo ? (
                <img
                  className="detail-title-logo"
                  src={createImageUrl(logo.file_path, "w500")}
                  width={logo.width}
                  height={logo.height}
                  alt=""
                  onError={() => setFailedLogo(logo.file_path)}
                />
              ) : movie.title}
            </h1>
            <div className="hero-meta">
              <span>{t(type === "tv" ? "media.series" : "media.movie")}</span>
              {year && <span>{year}</span>}
              {movie.runtime ? <span>{t("media.runtime", { minutes: movie.runtime })}</span> : null}
              {movie.number_of_seasons ? <span>{t("media.seasonCount", { count: movie.number_of_seasons })}</span> : null}
              {movie.number_of_episodes ? <span>{t("media.episodeCount", { count: movie.number_of_episodes })}</span> : null}
              {certification && <span className="detail-chip">{certification.rating}</span>}
              {movie.vote_count > 0 && (
                <span className="inline-flex items-center gap-1.5" title={t("media.voteCount", { count: movie.vote_count, votes })}>
                  <FaStar className="text-amber-300" aria-hidden="true" />
                  <strong className="text-white">{movie.vote_average.toFixed(1)}</strong> TMDB
                </span>
              )}
            </div>
            {movie.genres.length > 0 && (
              <p className="detail-genres">{movie.genres.map((genre) => t(`genres.${genre.id}`, { defaultValue: genre.name })).join(" · ")}</p>
            )}
            {movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}
            <p className="detail-overview">{movie.overview || t("media.noOverview")}</p>
            <div className="hero-actions">{actions}</div>
          </div>
        </div>
      </div>
      <div className="container">
        <dl className="detail-facts">
          {movie.status && <div><dt>{t("media.status")}</dt><dd>{movie.status}</dd></div>}
          {movie.original_language && <div><dt>{t("media.language")}</dt><dd>{movie.original_language.toUpperCase()}</dd></div>}
          {certification && (
            <div><dt>{t("media.ageRating")}</dt><dd>{certification.rating} · {certification.country}</dd></div>
          )}
          {!!movie.budget && (
            <div>
              <dt>{t("media.budget")}</dt>
              <dd>{new Intl.NumberFormat(i18n.resolvedLanguage, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(movie.budget)}</dd>
            </div>
          )}
          {/^(https?):\/\//.test(movie.homepage ?? "") && (
            <div><dt><a href={movie.homepage!} className="section-link" target="_blank" rel="noreferrer">{t("media.website")} ↗</a></dt><dd className="sr-only">{movie.title}</dd></div>
          )}
        </dl>
        {imdbUrl && (
          <div className="detail-reference-links">
            <a href={imdbUrl} className="section-link" target="_blank" rel="noreferrer">
              IMDb{imdbRating ? ` ${imdbRating.toFixed(1)} / 10` : ""} ↗
            </a>
            <a href={`${imdbUrl}parentalguide/`} className="section-link" target="_blank" rel="noreferrer">
              {t("media.parentsGuide")} ↗
            </a>
          </div>
        )}
      </div>
    </section>
  );
});
