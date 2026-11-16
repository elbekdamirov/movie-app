import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/app/store";
import { ContinueWatching } from "@/widgets/continue-watching";
import { MovieList } from "@/widgets/movie-list";

export const MyList = memo(() => {
  const saved = useSelector((state: RootState) => state.bookmarks.saved);
  const { t } = useTranslation();

  return (
    <div className="page-section library-page">
      <div className="container library-heading">
        <h1 className="page-title">{t("header.nav.myList")}</h1>
      </div>
      <ContinueWatching showEmpty />
      <section aria-labelledby="my-list-saved">
        <div className="container section-heading">
          <h2 id="my-list-saved">{t("header.nav.saved")}</h2>
        </div>
        {saved.length ? <MovieList movies={saved} loading={false} /> : (
          <div className="container">
            <div className="library-empty">
              <p className="muted">{t("myList.noSaved")}</p>
              <Link to="/movie" className="action action-secondary">{t("catalog.allMovies")}</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
});
