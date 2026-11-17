import { createImageUrl, getReleaseYear } from "@/shared/utils";
import { memo, type FC } from "react";
import { getMediaPath, type IMovie } from "../model/types";
import { Link } from "react-router-dom";
import { FaBookmark, FaRegBookmark, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "@/app/store";
import { toggleBookmark } from "../model/bookmarkSlice";

interface Props {
  movie?: IMovie;
  genre?: string;
  credit?: string;
  loading?: boolean;
  landscape?: boolean;
}

export const SaveTitleButton = ({ movie, hero = false }: { movie: IMovie; hero?: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const path = getMediaPath(movie);
  const isSaved = useSelector((state: RootState) =>
    state.bookmarks.saved.some((item) => getMediaPath(item) === path),
  );
  const label = t(isSaved ? "media.unsave" : "media.save");
  return (
    <button
      type="button"
      onClick={() => dispatch(toggleBookmark(movie))}
      title={label}
      aria-label={label}
      aria-pressed={isSaved}
      className={hero
        ? "action action-on-image hero-save"
        : `absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-md border border-white/20 text-white transition-colors ${isSaved ? "bg-py" : "bg-black/70 hover:bg-black"}`}
    >
      {isSaved ? <FaBookmark aria-hidden="true" /> : <FaRegBookmark aria-hidden="true" />}
    </button>
  );
};

export const MovieCard: FC<Props> = memo(({ movie, genre, credit, loading = false, landscape = false }) => {
  const { t } = useTranslation();
  const aspect = landscape ? "aspect-video" : "aspect-[2/3]";

  if (loading) {
    return (
      <div className="media-card motion-safe:animate-pulse" aria-hidden="true">
        <div className={`${aspect} bg-black/10 dark:bg-white/8`} />
        <div className="media-card-copy space-y-3">
          <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  if (!movie) return null;
  const year = getReleaseYear(movie.release_date);
  const artwork = landscape && movie.backdrop_path
    ? createImageUrl(movie.backdrop_path, "w780")
    : createImageUrl(movie.poster_path, "w500");

  return (
    <article className="media-card group relative">
      <Link to={getMediaPath(movie)} className="block rounded-[15px] focus-visible:outline-offset-[-3px]">
        <div className={`relative ${aspect} overflow-hidden bg-black/10 dark:bg-white/5`}>
          <img
            className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
            src={artwork}
            alt=""
            loading="lazy"
            decoding="async"
          />
          {movie.vote_count > 0 && (
            <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
              <FaStar className="text-amber-300" aria-hidden="true" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        <div className="media-card-copy">
          <h3 className="media-card-title" title={movie.title}>{movie.title}</h3>
          <p className="muted mt-1.5 truncate text-xs">
            {[year, (landscape || !genre) ? t(movie.media_type === "tv" ? "media.series" : "media.movie") : genre].filter(Boolean).join(" · ")}
          </p>
          {credit && <p className="muted mt-1 truncate text-xs" title={credit}>{credit}</p>}
        </div>
      </Link>
      <SaveTitleButton movie={movie} />
    </article>
  );
});
