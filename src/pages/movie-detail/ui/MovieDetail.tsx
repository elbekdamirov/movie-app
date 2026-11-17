import { Image } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { FaPlay } from "react-icons/fa";
import { HiFilm, HiXMark } from "react-icons/hi2";
import { NavLink, Outlet, useParams, useSearchParams } from "react-router-dom";
import { getTrailerUrl, MovieInfo, SaveTitleButton, useMovie, type IMovieDetail, type MediaType } from "@/entities/movie";
import type { EpisodeSelection } from "@/entities/movie/model/watchProgressSlice";
import { MediaPlayer } from "@/features/media-player";
import { StatusMessage } from "@/shared/ui";
import { createImageUrl } from "@/shared/utils";
import { MovieList } from "@/widgets/movie-list";
import { EpisodeRatings } from "./EpisodeRatings";
import { EpisodeRail } from "./EpisodeRail";

type VideoMode = "play" | "trailer";

const DetailContent = ({ movie, type, autoPlay, resume }: {
  movie: IMovieDetail;
  type: MediaType;
  autoPlay: boolean;
  resume: boolean;
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<VideoMode | null>(autoPlay ? "play" : null);
  const [request, setRequest] = useState({ episode: undefined as EpisodeSelection | undefined, revision: 0, resume });
  const progress = useSelector((state: RootState) => state.watchProgress.saved.find((item) =>
    item.id === movie.id && item.media_type === type));
  const playerSection = useRef<HTMLElement>(null);
  const activeButton = useRef<HTMLButtonElement>(null);
  const episodeButton = useRef<HTMLButtonElement>(null);
  const id = String(movie.id);
  const savedMovie = {
    id: movie.id,
    media_type: type,
    title: movie.title,
    release_date: movie.release_date,
    overview: movie.overview,
    backdrop_path: movie.backdrop_path,
    poster_path: movie.poster_path,
    original_language: movie.original_language,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    popularity: movie.popularity,
    genre_ids: movie.genres.map((genre) => genre.id),
  };
  const { getMovieInfo, getRecommendations } = useMovie();
  const { data: recommendations } = getRecommendations(movie, type);
  const { data: images } = getMovieInfo(id, "images", type);

  const trailerUrl = getTrailerUrl(movie.videos);
  const seasons = movie.seasons?.filter((season) => season.episode_count > 0).sort((a, b) =>
    Number(a.season_number === 0) - Number(b.season_number === 0) || a.season_number - b.season_number,
  ) ?? [];
  const canPlay = type === "movie" || seasons.length > 0;
  const playEpisode = (episode: EpisodeSelection, button: HTMLButtonElement) => {
    episodeButton.current = button;
    setRequest((current) => ({ episode, revision: current.revision + 1, resume: true }));
    setMode("play");
  };
  const openPlayer = (shouldResume: boolean, button: HTMLButtonElement) => {
    episodeButton.current = button;
    setRequest((current) => ({ episode: undefined, revision: current.revision + 1, resume: shouldResume }));
    setMode("play");
  };

  useEffect(() => {
    if (!mode) return;
    if (mode === "play" && request.revision) playerSection.current?.focus({ preventScroll: true });
    playerSection.current?.scrollIntoView({ block: "start" });
  }, [mode, request]);

  return (
    <div className="pb-12">
      {mode !== "play" && <MovieInfo
        movie={movie}
        type={type}
        logos={images?.logos}
        actions={
          <>
            {canPlay && (
              <button type="button" ref={activeButton} className={`action ${progress ? "action-on-image" : "action-primary"}`} onClick={(event) => openPlayer(false, event.currentTarget)}>
                <FaPlay className="size-3" aria-hidden="true" /> {t("watch")}
              </button>
            )}
            {canPlay && progress && (
              <button type="button" className="action action-primary order-first" onClick={(event) => openPlayer(true, event.currentTarget)}>
                <FaPlay className="size-3" aria-hidden="true" /> {t("media.resume")}
              </button>
            )}
            {trailerUrl && (
              <button type="button" ref={mode === "trailer" ? activeButton : null} className="action action-on-image" onClick={() => setMode("trailer")} aria-expanded={mode === "trailer"}>
                <HiFilm aria-hidden="true" /> {t("media.trailer")}
              </button>
            )}
            <SaveTitleButton hero movie={savedMovie} />
          </>
        }
      />}

      {mode && (
        <section ref={playerSection} className={`container player-section${mode === "play" ? " player-section--watch" : ""}`} aria-label={t(mode === "play" ? "watch" : "media.trailer")} tabIndex={-1}>
          {mode === "trailer" && <div className="section-heading">
            <h2 id="player-title">{t("media.trailer")}</h2>
            <button type="button" className="header-icon" aria-label={t("media.closePlayer")} onClick={() => {
              const trigger = activeButton.current;
              setMode(null);
              requestAnimationFrame(() => {
                trigger?.focus({ preventScroll: true });
                trigger?.scrollIntoView({ block: "nearest" });
              });
            }}>
              <HiXMark aria-hidden="true" />
            </button>
          </div>}
          {mode === "play" && canPlay && (
            <MediaPlayer
              key={request.revision}
              media={{
                id: movie.id,
                media_type: type,
                title: movie.title,
                backdrop_path: movie.backdrop_path,
                poster_path: movie.poster_path,
              }}
              seasons={seasons}
              resume={request.resume}
              initialEpisode={request.episode}
            />
          )}
          {mode === "play" && !canPlay && <StatusMessage message={t("media.noEpisodes")} />}
          {mode === "trailer" && trailerUrl && (
            <div className="player-frame">
              <iframe
                src={trailerUrl}
                className="size-full border-0"
                title={`${movie.title} — ${t("media.trailer")}`}
                allow="fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </section>
      )}

      {mode === "play" && <MovieInfo
        movie={movie}
        type={type}
        logos={images?.logos}
        compact
        actions={<>
          <SaveTitleButton hero movie={savedMovie} />
          <button type="button" className="action action-secondary" onClick={() => {
            setMode(null);
            requestAnimationFrame(() => {
              const trigger = episodeButton.current?.isConnected ? episodeButton.current : activeButton.current;
              trigger?.focus({ preventScroll: true });
              trigger?.scrollIntoView({ block: "nearest" });
            });
          }}>
            <HiXMark aria-hidden="true" /> {t("media.closePlayer")}
          </button>
          {trailerUrl && <button type="button" className="action action-secondary" onClick={() => setMode("trailer")}>
            <HiFilm aria-hidden="true" /> {t("media.trailer")}
          </button>}
        </>}
      />}

      {type === "tv" && seasons.length > 0 && (
        <>
          <EpisodeRail id={movie.id} seasons={seasons} progress={progress} onPlay={playEpisode} />
          <EpisodeRatings id={movie.id} seasons={seasons} onPlay={playEpisode} />
        </>
      )}

      <nav className="container detail-tabs" aria-label={t("media.details")}>
        <NavLink to="." end>{t("media.reviews")}</NavLink>
        <NavLink to="cast">{t("media.cast")}</NavLink>
        <NavLink to="others">{t("media.crew")}</NavLink>
      </nav>
      <Outlet context={{ id, type }} />

      {!!images?.backdrops?.length && (
        <section className="container mt-9">
          <div className="section-heading"><h2>{t("media.gallery")}</h2></div>
          <Image.PreviewGroup>
            <div className="flex gap-3 overflow-x-auto pb-3">
              {images.backdrops.slice(0, 12).map(({ file_path }, index) => (
                <Image
                  key={file_path}
                  className="aspect-video rounded-lg object-cover"
                  width={240}
                  src={createImageUrl(file_path, "w300")}
                  preview={{ src: createImageUrl(file_path, "w1280") }}
                  alt={`${movie.title} · ${index + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </Image.PreviewGroup>
        </section>
      )}

      {!!recommendations?.length && (
        <section className="mt-9">
          <div className="container section-heading"><h2>{t("media.moreLikeThis")}</h2></div>
          <MovieList movies={recommendations.slice(0, 4)} loading={false} />
        </section>
      )}
    </div>
  );
};

export const MovieDetail = ({ type = "movie" }: { type?: MediaType }) => {
  const { t } = useTranslation();
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { getMovieById } = useMovie();
  const { data, isPending, isError, refetch } = getMovieById(id, type);

  if (!/^[1-9]\d*$/.test(id)) return <StatusMessage message={t("media.notFound")} />;
  if (isPending) {
    return <div className="hero-shell hero-skeleton motion-safe:animate-pulse" role="status" aria-label={t("catalog.loading")} />;
  }
  if (isError || !data) return <StatusMessage message={t("media.notFound")} onRetry={() => void refetch()} />;

  return <DetailContent
    key={`${type}/${id}`}
    movie={data}
    type={type}
    autoPlay={searchParams.get("play") === "1"}
    resume={searchParams.get("resume") === "1"}
  />;
};
