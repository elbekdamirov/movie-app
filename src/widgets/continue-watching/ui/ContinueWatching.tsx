import { useTranslation } from "react-i18next";
import { FaPlay } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "@/app/store";
import { getMediaPath } from "@/entities/movie";
import { removeWatchProgress } from "@/entities/movie/model/watchProgressSlice";
import { createImageUrl } from "@/shared/utils";
import { HorizontalRail } from "@/widgets/movie-list";

const formatPosition = (position: number) => {
  const seconds = String(position % 60).padStart(2, "0");
  const minutes = Math.floor(position / 60);
  if (minutes < 60) return `${minutes}:${seconds}`;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${seconds}`;
};

export const ContinueWatching = ({ showEmpty = false }: { showEmpty?: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const saved = useSelector((state: RootState) => state.watchProgress.saved);

  if (!saved.length && !showEmpty) return null;
  const label = t("media.continueWatching");

  return (
    <section className="home-movie-section" aria-labelledby="continue-watching">
      <div className="container section-heading">
        <h2 id="continue-watching">{label}</h2>
      </div>
      {saved.length ? <HorizontalRail count={saved.length} label={label}>
        <div className="movie-rail-cards continue-cards">
          {saved.map((item) => {
            const path = getMediaPath(item);
            const labelId = `continue-${item.media_type}-${item.id}`;
            const image = item.backdrop_path
              ? createImageUrl(item.backdrop_path, "w780")
              : createImageUrl(item.poster_path, "w500");
            return (
              <article key={path} className="continue-card">
                <Link
                  to={`${path}?play=1&resume=1`}
                  className="continue-card-link"
                  aria-labelledby={`${labelId}-title ${labelId}-position`}
                >
                  <div className="continue-card-art">
                    <img src={image} alt="" loading="lazy" decoding="async" />
                    <span className="continue-card-play" aria-hidden="true"><FaPlay /></span>
                    {item.duration && (
                      <progress className="continue-card-progress" value={item.position} max={item.duration} aria-label={t("media.watchProgress")} />
                    )}
                  </div>
                  <div className="continue-card-copy">
                    <p id={`${labelId}-title`} className="truncate font-semibold">{item.title}</p>
                    <p id={`${labelId}-position`} className="muted truncate text-sm">
                      {item.episode && <>{t("media.resumeEpisode", { ...item.episode })} · </>}
                      {t("media.resumeAt", { time: formatPosition(item.position) })}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  className="continue-card-remove"
                  aria-label={t("media.removeFromContinueWatching", { title: item.title })}
                  title={t("media.removeFromContinueWatching", { title: item.title })}
                  onClick={() => dispatch(removeWatchProgress({ id: item.id, media_type: item.media_type }))}
                >
                  <HiXMark aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      </HorizontalRail> : (
        <div className="container">
          <div className="library-empty"><p className="muted">{t("myList.noProgress")}</p></div>
        </div>
      )}
    </section>
  );
};
