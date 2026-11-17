import { CrewView, getFilmography, useCrew } from "@/entities/crew";
import { getAwardCategoryKey, getAwardTitlePath, getPersonAwards, useOscarHistory } from "@/entities/award";
import { FilterTabs, StatusMessage } from "@/shared/ui";
import { MovieList } from "@/widgets/movie-list";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

type CreditFilter = "all" | "movie" | "tv";
const pageSize = 8;

const PersonDetail = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { getCrewById, getCrewCreditsById } = useCrew();
  const person = getCrewById(id);
  const credits = getCrewCreditsById(id);
  const { data: oscarHistory } = useOscarHistory();
  const [filter, setFilter] = useState<CreditFilter>("all");
  const [limit, setLimit] = useState(pageSize);
  const isCast = !!credits.data?.cast?.length;
  const filmography = useMemo(() => getFilmography(
    (isCast ? credits.data?.cast : credits.data?.crew) ?? [],
  ), [credits.data, isCast]);

  if (person.isPending) return <StatusMessage message={t("catalog.loading")} />;
  if (person.isError || !person.data) {
    return <StatusMessage message={t("people.notFound")} onRetry={() => void person.refetch()} />;
  }

  const awards = getPersonAwards(person.data.id, oscarHistory);
  const filtered = filmography.filter((movie) => filter === "all" || (movie.media_type ?? "movie") === filter);
  const movieCount = filmography.filter((movie) => movie.media_type !== "tv").length;
  const tvCount = filmography.length - movieCount;

  return (
    <div className="page-section">
      <CrewView person={person.data} />

      {awards.length > 0 && (
        <section className="container awards-section" aria-labelledby="person-awards">
          <div className="section-heading">
            <h2 id="person-awards">{t("awards.title")}</h2>
            <Link className="section-link" to="/awards">{t("awards.browse")}</Link>
          </div>
          <ul className="awards-list">
            {awards.map((award, index) => (
              <li key={`${award.ceremony}/${award.year}/${award.category}/${index}`} className="award-row">
                <p className="muted text-sm">{award.year} {t(`awards.${award.ceremony}`)}</p>
                <div>
                  <p className="font-semibold">
                    {t(`awards.categories.${getAwardCategoryKey(award)}`, { defaultValue: award.category })}
                  </p>
                  {award.title && <Link className="award-title muted" to={getAwardTitlePath(award.title)}>{award.title.name}</Link>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="filmography">
        <div className="container mb-5">
          <div className="section-heading flex-wrap">
            <h2 id="filmography">{t(credits.data && !isCast ? "people.workedOn" : "people.appearedIn")}</h2>
            {filmography.length > 0 && <p className="muted text-sm">{t("people.featuredOrder")}</p>}
          </div>
          {filmography.length > 0 && (
            <FilterTabs<CreditFilter>
              label={t("people.filterCredits")}
              value={filter}
              onChange={(next) => {
                setFilter(next);
                setLimit(pageSize);
              }}
              options={[
                { value: "all", label: `${t("All")} · ${filmography.length}` },
                { value: "movie", label: `${t("header.nav.movies")} · ${movieCount}` },
                { value: "tv", label: `${t("header.nav.series")} · ${tvCount}` },
              ]}
            />
          )}
        </div>

        {credits.isPending ? <MovieList loading /> : credits.isError ? (
          <StatusMessage message={t("catalog.loadError")} onRetry={() => void credits.refetch()} />
        ) : filtered.length > 0 ? (
          <MovieList movies={filtered.slice(0, limit)} loading={false} />
        ) : <StatusMessage message={t("people.noCredits")} />}

        {filtered.length > limit && (
          <div className="flex justify-center pt-6">
            <button className="action action-secondary" type="button" onClick={() => setLimit((count) => count + pageSize)}>
              {t("people.showMore")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export const CrewDetail = () => {
  const { t } = useTranslation();
  const { id = "" } = useParams();
  if (!/^[1-9]\d*$/.test(id)) return <StatusMessage message={t("people.notFound")} />;
  return <PersonDetail id={id} key={id} />;
};
