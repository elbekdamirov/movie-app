import { getMediaPath, SaveTitleButton, type IMovie } from "@/entities/movie";
import { memo, useRef, useState, type FC } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { createImageUrl, getReleaseYear } from "@/shared/utils";
import { FaPlay, FaStar } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  movies: IMovie[];
  loading: boolean;
}

export const Hero: FC<Props> = memo(({ movies, loading }) => {
  const swiper = useRef<SwiperInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();
  const active = Math.min(activeIndex, movies.length - 1);

  if (loading) return <div className="hero-shell hero-skeleton motion-safe:animate-pulse" aria-hidden="true" />;
  if (!movies.length) return null;

  return (
    <section className="hero-shell relative isolate overflow-hidden" aria-label={t("catalog.featured")}>
      <Swiper
        onSwiper={(instance) => { swiper.current = instance; }}
        onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
        modules={[A11y]}
        rewind
        className="hero-swiper"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            <div className="hero-slide">
              <img
                className="hero-image"
                src={createImageUrl(movie.backdrop_path, "w1280")}
                srcSet={`${createImageUrl(movie.backdrop_path, "w780")} 780w, ${createImageUrl(movie.backdrop_path, "w1280")} 1280w`}
                sizes="100vw"
                alt=""
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="container hero-content">
                <div className="hero-copy" inert={index !== active}>
                  <div className="hero-kicker">{t("catalog.featured")}</div>
                  <h2>{movie.title}</h2>
                  <p className="hero-meta">
                    {movie.vote_count > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <FaStar className="text-amber-300" aria-hidden="true" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    )}
                    {getReleaseYear(movie.release_date)}
                    <span>{t("media.movie")}</span>
                  </p>
                  {movie.overview && <p className="hero-overview">{movie.overview}</p>}
                  <div className="hero-actions">
                    <Link className="action action-primary" to={`${getMediaPath(movie)}?play=1`}>
                      <FaPlay className="size-3" aria-hidden="true" /> {t("watch")}
                    </Link>
                    <Link className="action action-on-image" to={getMediaPath(movie)}>
                      {t("media.details")}
                    </Link>
                    <SaveTitleButton movie={movie} hero />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {movies.length > 1 && (
        <div className="container hero-controls">
          <div className="hero-thumbs">
            {movies.map((movie, index) => (
              <button
                type="button"
                key={movie.id}
                aria-label={movie.title}
                aria-pressed={index === active}
                onClick={() => swiper.current?.slideTo(index)}
              >
                <img src={createImageUrl(movie.backdrop_path, "w300")} alt="" />
              </button>
            ))}
          </div>
          <button type="button" className="hero-arrow" aria-label={t("catalog.previousSlide")} onClick={() => swiper.current?.slidePrev()}>
            <HiArrowLeft aria-hidden="true" />
          </button>
          <button type="button" className="hero-arrow" aria-label={t("catalog.nextSlide")} onClick={() => swiper.current?.slideNext()}>
            <HiArrowRight aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
});
