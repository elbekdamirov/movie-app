import { getMediaPath, useMovie, type IMovie, type HomeMovieFeed } from "@/entities/movie";
import { StatusMessage } from "@/shared/ui";
import { ContinueWatching } from "@/widgets/continue-watching";
import { Hero } from "@/widgets/hero";
import { MovieRail } from "@/widgets/movie-list";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

const movieRows: { feed: HomeMovieFeed; title: string }[] = [
  { feed: "now_playing", title: "nowPlaying" },
  { feed: "top_rated", title: "topRated" },
  { feed: "upcoming", title: "upcoming" },
];

const HomeMovieRow = ({ feed, title }: (typeof movieRows)[number]) => {
  const { t } = useTranslation();
  const { getHomeMovies } = useMovie();
  const { data, isPending, isError, refetch } = getHomeMovies(feed);
  const label = t(`catalog.${title}`);
  const id = `home-${feed}`;

  return (
    <section className="home-movie-section" aria-labelledby={id}>
      <div className="container section-heading"><h2 id={id}>{label}</h2></div>
      {isError ? (
        <StatusMessage message={t("catalog.loadError")} onRetry={() => void refetch()} />
      ) : !isPending && !data?.results.length ? (
        <StatusMessage message={t("catalog.noTitles")} />
      ) : (
        <MovieRail movies={data?.results} loading={isPending} label={label} />
      )}
    </section>
  );
};

const HomeTvRow = () => {
  const { t } = useTranslation();
  const { getMovies } = useMovie();
  const { data, isPending, isError, refetch } = getMovies({ page: 1 }, "tv");
  const label = t("header.nav.series");

  return (
    <section className="home-movie-section" aria-labelledby="home-tv-shows">
      <div className="container section-heading">
        <h2 id="home-tv-shows">
          <Link className="inline-flex items-center gap-2 hover:text-py" to="/tv">
            {label} <HiArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </h2>
      </div>
      {isError ? <StatusMessage message={t("catalog.loadError")} onRetry={() => void refetch()} /> : (
        !isPending && !data?.results.length
          ? <StatusMessage message={t("catalog.noTitles")} />
          : <MovieRail movies={data?.results} loading={isPending} label={label} />
      )}
    </section>
  );
};

export const Home = memo(() => {
  const { t } = useTranslation();
  const { getInfiniteMovies } = useMovie();
  const {
    data, isPending, isError, isFetchingNextPage, isFetchNextPageError, hasNextPage,
    fetchNextPage, refetch,
  } = getInfiniteMovies();
  const loadMore = useCallback(() => {
    void fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage]);

  const movies = useMemo(() => {
    const titles = new Map<string, IMovie>();
    for (const page of data?.pages ?? []) {
      for (const movie of page.results) titles.set(getMediaPath(movie), movie);
    }
    return [...titles.values()];
  }, [data]);

  const featured = data?.pages[0]?.results.filter((movie) => movie.backdrop_path).slice(0, 6) ?? [];
  const popular = t("catalog.popularMovies");

  return (
    <>
      <Hero movies={featured} loading={isPending} />
      <div className="home-movie-rows">
        <ContinueWatching />
        <section className="home-movie-section" aria-labelledby="popular-movies">
          <div className="container section-heading">
            <h1 id="popular-movies">{popular}</h1>
            <Link className="section-link" to="/movie">
              {t("catalog.allMovies")} <HiArrowRight aria-hidden="true" />
            </Link>
          </div>
          {isError && !data ? (
            <StatusMessage message={t("catalog.loadError")} onRetry={() => void refetch()} />
          ) : movies.length || isPending ? (
            <MovieRail
              movies={movies}
              loading={isPending}
              label={popular}
              loadingMore={isFetchingNextPage}
              onLoadMore={hasNextPage && !isFetchNextPageError ? loadMore : undefined}
            />
          ) : (
            <StatusMessage message={t("catalog.noTitles")} />
          )}
          {isFetchingNextPage && <p className="container muted mt-2 text-sm" role="status">{t("catalog.loading")}</p>}
          {isFetchNextPageError && <StatusMessage message={t("catalog.loadMoreError")} onRetry={loadMore} />}
        </section>
        <HomeTvRow />
        {movieRows.map((row) => <HomeMovieRow key={row.feed} {...row} />)}
      </div>
    </>
  );
});
