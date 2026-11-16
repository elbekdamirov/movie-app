import { useQueries } from "@tanstack/react-query";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { seasonQueryOptions, type ISeason } from "@/entities/movie";
import type { EpisodeSelection } from "@/entities/movie/model/watchProgressSlice";
import { StatusMessage } from "@/shared/ui";

const seasonBatch = 8;

const scoreBand = (score?: number) => {
  if (score === undefined) return "unrated";
  if (score >= 8) return "high";
  if (score >= 7) return "good";
  if (score >= 6) return "fair";
  return "low";
};

export const EpisodeRatings = ({ id, seasons, onPlay }: {
  id: number;
  seasons: ISeason[];
  onPlay: (episode: EpisodeSelection, button: HTMLButtonElement) => void;
}) => {
  const { t, i18n } = useTranslation();
  const labelId = useId();
  const [limit, setLimit] = useState(seasonBatch);
  const visibleSeasons = seasons.slice(0, limit);
  const results = useQueries({
    queries: visibleSeasons.map(({ season_number }) => seasonQueryOptions(id, season_number)),
  });
  const columns = visibleSeasons.map((season, index) => ({
    season,
    episodes: new Map(results[index].data?.episodes.map((episode) => [episode.episode_number, episode])),
  }));
  const rows = [...new Set(columns.flatMap(({ episodes }) => [...episodes.keys()]))].sort((a, b) => a - b);
  const loading = results.some((result) => result.isPending);
  const failed = results.filter((result) => result.isError);
  const format = new Intl.NumberFormat(i18n.resolvedLanguage, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <section className="container episode-ratings" aria-labelledby={labelId}>
      <div className="section-heading">
        <h2 id={labelId}>{t("media.episodeRatings")}</h2>
      </div>
      <p className="muted text-sm">{t("media.episodeRatingsSource")}</p>
      {rows.length > 0 && (
        <div className="episode-ratings-grid" style={{ width: `min(100%, ${(columns.length + 1) * 46 + 6}px)` }}>
          <table className="episode-ratings-table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">{t("media.episode")}</span></th>
                {columns.map(({ season }) => (
                  <th scope="col" key={season.season_number} title={season.name}>
                    {t("media.seasonShort", { number: season.season_number })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((number) => (
                <tr key={number}>
                  <th scope="row">{t("media.episodeShort", { number })}</th>
                  {columns.map(({ season, episodes }) => {
                    const item = episodes.get(number);
                    const selection = { season: season.season_number, episode: number };
                    const score = item && item.vote_count > 0 && Number.isFinite(item.vote_average)
                      ? item.vote_average
                      : undefined;
                    const rating = score === undefined ? undefined : format.format(score);
                    const label = item && t("media.playEpisode", {
                      episode: t("media.resumeEpisode", selection),
                      title: item.name,
                    });
                    return (
                      <td key={season.season_number}>
                        {item ? (
                          <button
                            type="button"
                            className="episode-rating"
                            data-score={scoreBand(score)}
                            aria-label={`${label}, ${rating === undefined ? t("media.unratedEpisode") : t("media.episodeScore", { rating })}`}
                            title={label}
                            onClick={(event) => onPlay(selection, event.currentTarget)}
                          >
                            {rating ?? "–"}
                          </button>
                        ) : <span className="episode-rating-missing">–</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {loading && <p className="muted mt-3 text-sm" role="status">{t("catalog.loading")}</p>}
      {failed.length > 0 && (
        <StatusMessage
          message={t("media.episodeRatingsError")}
          onRetry={() => void Promise.all(failed.map((season) => season.refetch()))}
        />
      )}
      {!rows.length && !loading && !failed.length && <StatusMessage message={t("media.noEpisodes")} />}
      {visibleSeasons.length < seasons.length && (
        <button type="button" className="action action-secondary mt-4" onClick={() => setLimit((count) => count + seasonBatch)}>
          {t("media.moreSeasons")}
        </button>
      )}
    </section>
  );
};
