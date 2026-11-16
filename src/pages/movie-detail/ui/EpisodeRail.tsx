import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlay, FaStar } from "react-icons/fa";
import { HiOutlineFilm } from "react-icons/hi2";
import { useSeason, type ISeason } from "@/entities/movie";
import type { EpisodeSelection, WatchProgress } from "@/entities/movie/model/watchProgressSlice";
import { AppSelect, StatusMessage } from "@/shared/ui";
import { createImageUrl } from "@/shared/utils";
import { HorizontalRail } from "@/widgets/movie-list";

export const EpisodeRail = ({ id, seasons, progress, onPlay }: {
  id: number;
  seasons: ISeason[];
  progress?: WatchProgress;
  onPlay: (episode: EpisodeSelection, button: HTMLButtonElement) => void;
}) => {
  const { t, i18n } = useTranslation();
  const labelId = useId();
  const [season, setSeason] = useState(() =>
    seasons.find((item) => item.season_number === progress?.episode?.season)?.season_number ?? seasons[0].season_number,
  );
  const { data, isPending, isError, refetch } = useSeason(id, season);
  const label = t("media.episodes");
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: "medium", timeZone: "UTC" });
  const score = new Intl.NumberFormat(i18n.resolvedLanguage, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <section className="episode-gallery" aria-labelledby={labelId}>
      <div className="container section-heading episode-gallery-heading">
        <h2 id={labelId}>{label}</h2>
        <AppSelect<number>
          className="episode-gallery-select"
          aria-label={t("media.season")}
          value={season}
          onChange={setSeason}
          options={seasons.map(({ season_number, name }) => ({ value: season_number, label: name }))}
        />
      </div>
      {isPending ? (
        <StatusMessage message={t("catalog.loading")} />
      ) : isError && !data ? (
        <StatusMessage message={t("media.episodeError")} onRetry={() => void refetch()} />
      ) : data?.episodes.length ? (
        <HorizontalRail key={season} count={data.episodes.length} label={label}>
          <div className="movie-rail-cards episode-cards">
            {data.episodes.map((item) => {
              const episode = { season, episode: item.episode_number };
              const number = t("media.resumeEpisode", episode);
              const saved = progress?.episode?.season === season && progress.episode.episode === item.episode_number
                ? progress : undefined;
              const airDate = Date.parse(item.air_date ?? "");
              const metadata = [
                item.runtime && t("media.runtime", { minutes: item.runtime }),
                Number.isFinite(airDate) && date.format(airDate),
              ].filter(Boolean).join(" · ");

              return (
                <button
                  key={item.id}
                  type="button"
                  className="episode-card"
                  aria-label={saved
                    ? `${t("media.resume")} · ${number} · ${item.name}`
                    : t("media.playEpisode", { episode: number, title: item.name })}
                  onClick={(event) => onPlay(episode, event.currentTarget)}
                >
                  <span className="episode-card-art">
                    {item.still_path ? (
                      <img src={createImageUrl(item.still_path, "original")} alt="" loading="lazy" decoding="async" />
                    ) : <HiOutlineFilm className="episode-card-placeholder" aria-hidden="true" />}
                    <span className="episode-card-play" aria-hidden="true"><FaPlay /></span>
                    {saved && <span className="episode-resume-badge">{t("media.resume")}</span>}
                    {saved?.duration && (
                      <progress className="continue-card-progress" value={saved.position} max={saved.duration} aria-label={t("media.watchProgress")} />
                    )}
                  </span>
                  <span className="episode-card-copy">
                    <span className="episode-card-title">{number} <span aria-hidden="true">·</span> {item.name}</span>
                    {item.overview && <span className="episode-card-overview muted">{item.overview}</span>}
                    {(metadata || item.vote_count > 0) && (
                      <span className="episode-card-meta muted">
                        {metadata}
                        {item.vote_count > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <FaStar className="text-amber-400" aria-hidden="true" /> {score.format(item.vote_average)}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </HorizontalRail>
      ) : <StatusMessage message={t("media.noEpisodes")} />}
    </section>
  );
};
