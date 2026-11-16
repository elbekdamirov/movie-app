import { getMediaPath, MovieCard, useMovie, type IMovie } from "@/entities/movie";
import { memo, type FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  movies?: (IMovie & { credit?: string })[];
  loading: boolean;
  horizontal?: boolean;
  landscape?: boolean;
}

export const MovieList: FC<Props> = memo(({ movies = [], loading, horizontal = false, landscape = false }) => {
  const { getGenres } = useMovie();
  const { t } = useTranslation();
  const { data: movieGenres } = getGenres("movie", !landscape && movies.some((item) => item.media_type !== "tv"));
  const { data: tvGenres } = getGenres("tv", !landscape && movies.some((item) => item.media_type === "tv"));

  return (
    <div className={horizontal ? "movie-rail-cards" : "container media-grid"} aria-busy={loading}>
      {loading
        ? Array.from({ length: 8 }, (_, i) => <MovieCard key={i} loading landscape={landscape} />)
        : movies.map((item) => {
            const genres = item.media_type === "tv" ? tvGenres?.genres : movieGenres?.genres;
            const genre = genres?.find(({ id }) => item.genre_ids?.includes(id));
            return (
              <MovieCard
                key={getMediaPath(item)}
                movie={item}
                credit={item.credit}
                landscape={landscape}
                genre={genre && t(`genres.${genre.id}`, { defaultValue: genre.name })}
              />
            );
          })}
    </div>
  );
});
