import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchMovie } from "../model/useSearchMovie";
import { getSearchFilter } from "../model/searchLocation";
import type { SearchFilter } from "../api/fetchApi";
import { MovieList } from "@/widgets/movie-list";
import { MoviePagination } from "@/features/movie-pagination";
import { PersonCard } from "@/entities/crew";
import { MAX_TMDB_PAGE } from "@/entities/movie";
import { FilterTabs, StatusMessage } from "@/shared/ui";
import { useTranslation } from "react-i18next";

const searchFilters = [
  { value: "multi", label: "All" },
  { value: "movie", label: "header.nav.movies" },
  { value: "tv", label: "header.nav.series" },
  { value: "person", label: "search.people" },
] satisfies { value: SearchFilter; label: string }[];

export const SearchMovie = memo(() => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const type = getSearchFilter(params.get("type"));
  const rawPage = Number(params.get("page"));
  const page = Number.isInteger(rawPage) ? Math.max(1, Math.min(rawPage, MAX_TMDB_PAGE)) : 1;
  const { getMovieBySearch } = useSearchMovie();
  const { data, isPending, isError, refetch } = getMovieBySearch({ query, page, type }, !!query);
  const { t } = useTranslation();

  const changeType = (filter: SearchFilter) => {
    const next = new URLSearchParams(params);
    if (filter === "multi") next.delete("type");
    else next.set("type", filter);
    next.delete("page");
    setParams(next);
  };

  const people = data?.results.filter((item) => item.media_type === "person") ?? [];
  const titles = data?.results.filter((item) => item.media_type !== "person") ?? [];

  return (
    <div className="page-section">
      <div className="container search-results-heading">
        <h1 className="page-title">{t(query ? "search.resultsHeading" : "header.nav.search", { query })}</h1>
        {data && (
          <p className="muted text-sm" role="status">
            {t("search.resultsCount", { count: data.total_results })}
          </p>
        )}
        <FilterTabs
          label={t("search.filterLabel")}
          value={type}
          options={searchFilters.map(({ value, label }) => ({ value, label: t(label) }))}
          onChange={changeType}
        />
      </div>

      {!query ? (
        <StatusMessage message={t("search.startTyping")} />
      ) : isPending ? (
        <MovieList loading landscape />
      ) : isError ? (
        <StatusMessage message={t("search.loadError")} onRetry={() => void refetch()} />
      ) : (
        <>
          {titles.length > 0 && <MovieList movies={titles} loading={false} landscape />}
          {people.length > 0 && (
            <section className={titles.length > 0 ? "mt-8" : undefined} aria-label={t("search.people")}>
              {titles.length > 0 && <div className="container section-heading"><h2>{t("search.people")}</h2></div>}
              <div className="container people-search-grid">
                {people.map((person) => <PersonCard key={person.id} person={person} />)}
              </div>
            </section>
          )}
          {!data.results.length && <StatusMessage message={t("search.noResults", { query })} />}
          <MoviePagination page={page} total_pages={data.total_pages} />
        </>
      )}
    </div>
  );
});
