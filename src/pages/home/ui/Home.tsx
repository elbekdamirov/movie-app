import { getMediaPath, useHomeFeed, type IMovie, type HomeFeed } from "@/entities/movie";
import { StatusMessage } from "@/shared/ui";
import { ContinueWatching } from "@/widgets/continue-watching";
import { Hero } from "@/widgets/hero";
import { MovieRail } from "@/widgets/movie-list";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

const catalogRows: { feed: HomeFeed; title: string; id: string }[] = [
  { feed: "tv", title: "header.nav.series", id: "home-tv-shows" },
  { feed: "now_playing", title: "catalog.nowPlaying", id: "home-now_playing" },
  { feed: "top_rated", title: "catalog.topRated", id: "home-top_rated" },
  { feed: "upcoming", title: "catalog.upcoming", id: "home-upcoming" },
];

type FeedQuery = ReturnType<typeof useHomeFeed>;

const HomeFeedRail = ({ label, query }: { label: string; query: FeedQuery }) => {
  const { t } = useTranslation();
  const {
    data, isPending, isError, isFetchingNextPage, isFetchNextPageError, hasNextPage,
    fetchNextPage, refetch,
  } = query;
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

  if (isError && !data) {
    return <StatusMessage message={t("catalog.loadError")} onRetry={() => void refetch()} />;
  }
  if (!movies.length && !isPending) return <StatusMessage message={t("catalog.noTitles")} />;

  return (
    <>
      <MovieRail
        movies={movies}
        loading={isPending}
        label={label}
        loadingMore={isFetchingNextPage}
        onLoadMore={hasNextPage && !isFetchNextPageError ? loadMore : undefined}
      />
      {isFetchingNextPage && <p className="sr-only" role="status">{t("catalog.loading")}</p>}
      {isFetchNextPageError && <StatusMessage message={t("catalog.loadMoreError")} onRetry={loadMore} />}
    </>
  );
};

const HomeCatalogRow = ({ feed, title, id }: (typeof catalogRows)[number]) => {
  const { t } = useTranslation();
  const query = useHomeFeed(feed);
  const label = t(title);

  return (
    <section className="home-movie-section" aria-labelledby={id}>
      <div className="container section-heading">
        <h2 id={id}>
          {feed === "tv" ? (
            <Link className="inline-flex items-center gap-2 hover:text-py" to="/tv">
              {label} <HiArrowRight className="size-5" aria-hidden="true" />
            </Link>
          ) : label}
        </h2>
      </div>
      <HomeFeedRail label={label} query={query} />
    </section>
  );
};

export const Home = memo(() => {
  const { t } = useTranslation();
  const query = useHomeFeed();
  const featured = query.data?.pages[0]?.results.filter((movie) => movie.backdrop_path).slice(0, 6) ?? [];
  const popular = t("catalog.popularMovies");

  return (
    <>
      <Hero movies={featured} loading={query.isPending} />
      <div className="home-movie-rows">
        <ContinueWatching />
        <section className="home-movie-section" aria-labelledby="popular-movies">
          <div className="container section-heading">
            <h1 id="popular-movies">{popular}</h1>
            <Link className="section-link" to="/movie">
              {t("catalog.allMovies")} <HiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <HomeFeedRail label={popular} query={query} />
        </section>
        {catalogRows.map((row) => <HomeCatalogRow key={row.feed} {...row} />)}
      </div>
    </>
  );
});
