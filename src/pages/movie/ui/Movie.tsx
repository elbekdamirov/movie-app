import { MAX_TMDB_PAGE, useMovie, type MediaType } from "@/entities/movie";
import { MovieFilter } from "@/features/movie-filter";
import { MovieFilterYear } from "@/features/movie-filter-year";
import { MoviePagination } from "@/features/movie-pagination";
import { MovieSort } from "@/features/movie-sort";
import { StatusMessage } from "@/shared/ui";
import { MovieList } from "@/widgets/movie-list";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export const Movie = memo(({ type = "movie" }: { type?: MediaType }) => {
  const { getMovies } = useMovie();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isInteger(rawPage) ? Math.max(1, Math.min(rawPage, MAX_TMDB_PAGE)) : 1;
  const sort_by = searchParams.get("sort_by") || "popularity.desc";
  const with_genres = searchParams.get("with_genres") || undefined;
  const range = searchParams.get("year_range")?.match(/^(\d{4})-(\d{4})$/);
  const dateKey = type === "tv" ? "first_air_date" : "primary_release_date";
  const dateFilters = range && range[1] <= range[2]
    ? { [`${dateKey}.gte`]: `${range[1]}-01-01`, [`${dateKey}.lte`]: `${range[2]}-12-31` }
    : {};

  const { data, isPending, isError, refetch } = getMovies({ page, sort_by, with_genres, ...dateFilters }, type);

  return (
    <div className="page-section">
      <div className="container">
        <h1 className="page-title">{t(type === "tv" ? "header.nav.series" : "header.nav.movies")}</h1>
        <div className="catalog-toolbar">
          <p className="muted text-sm" aria-live="polite">
            {data && t("catalog.results", { count: data.total_results })}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <MovieFilterYear />
            <MovieSort type={type} />
            <MovieFilter type={type} />
          </div>
        </div>
      </div>

      {isError ? (
        <StatusMessage message={t("catalog.loadError")} onRetry={() => void refetch()} />
      ) : data && !data.results.length ? (
        <StatusMessage message={t("catalog.empty")} />
      ) : (
        <MovieList movies={data?.results} loading={isPending} />
      )}

      {data && <MoviePagination page={page} total_pages={data.total_pages} />}
    </div>
  );
});
