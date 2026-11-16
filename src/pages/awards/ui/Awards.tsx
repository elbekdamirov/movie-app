import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineTrophy, HiArrowUpRight } from "react-icons/hi2";
import {
  getAwardCategoryKey, getAwardPersonPath, getAwardTitlePath,
  useEmmyHistory, useOscarHistory, type AwardCeremony, type AwardCeremonyType,
} from "@/entities/award";
import { AppSelect, FilterTabs, StatusMessage } from "@/shared/ui";

type CeremonyFilter = "all" | AwardCeremonyType;
const getYears = (ceremonies: AwardCeremony[]) =>
  [...new Set(ceremonies.map(({ year }) => year))].sort((a, b) => b - a);

export const Awards = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const choice = params.get("ceremony");
  const filter = choice === "oscars" || choice === "emmys" ? choice : "all";
  const oscars = useOscarHistory();
  const emmys = useEmmyHistory();
  const ceremonies = [...(oscars.data ?? []), ...(emmys.data ?? [])];
  const inFilter = (ceremony: AwardCeremony, current: CeremonyFilter) =>
    current === "all" || ceremony.id === current;
  const matches = ceremonies.filter((ceremony) => inFilter(ceremony, filter));
  const years = getYears(matches);
  const requestedYear = Number(params.get("year"));
  const year = years.includes(requestedYear) ? requestedYear : years[0];
  const selected = matches.filter((ceremony) => ceremony.year === year);
  const isPending = (filter !== "emmys" && oscars.isPending) || (filter !== "oscars" && emmys.isPending);
  const isError = (filter !== "emmys" && oscars.isError) || (filter !== "oscars" && emmys.isError);

  const update = (nextFilter: CeremonyFilter, nextYear?: number) => {
    const next = new URLSearchParams(params);
    if (nextFilter === "all") next.delete("ceremony");
    else next.set("ceremony", nextFilter);
    if (nextYear) next.set("year", String(nextYear));
    else next.delete("year");
    setParams(next);
  };

  const changeFilter = (nextFilter: CeremonyFilter) => {
    const available = getYears(ceremonies.filter((ceremony) => inFilter(ceremony, nextFilter)));
    update(nextFilter, year && available.includes(year) ? year : available[0]);
  };

  return (
    <div className="container page-section">
      <div className="search-panel">
        <HiOutlineTrophy className="size-8 text-py" aria-hidden="true" />
        <h1 className="page-title">{t("awards.title")}</h1>
        <p className="muted">{t("awards.description")}</p>
        <div className="awards-controls">
          <FilterTabs<CeremonyFilter>
            label={t("awards.filterLabel")}
            value={filter}
            options={[
              { value: "all", label: t("All") },
              { value: "oscars", label: t("awards.oscars") },
              { value: "emmys", label: t("awards.emmys") },
            ]}
            onChange={changeFilter}
          />
          <div>
            <label htmlFor="award-year" className="muted block text-xs font-semibold">{t("awards.year")}</label>
            <AppSelect<number>
              id="award-year"
              aria-label={t("awards.year")}
              className="awards-year"
              value={year}
              options={years.map((value) => ({ value, label: String(value) }))}
              onChange={(value) => update(filter, value)}
              showSearch
              optionFilterProp="label"
              disabled={!years.length}
            />
          </div>
        </div>
      </div>

      {isPending && <StatusMessage message={t("catalog.loading")} />}
      {isError && <StatusMessage message={t("awards.loadError")} onRetry={() => {
        if (oscars.isError) void oscars.refetch();
        if (emmys.isError) void emmys.refetch();
      }} />}

      {selected.map((ceremony) => (
        <section key={ceremony.id} className="awards-section" aria-labelledby={`award-${ceremony.id}`}>
          <div className="section-heading flex-wrap">
            <h2 id={`award-${ceremony.id}`}>{ceremony.year} {t(`awards.${ceremony.id}`)}</h2>
            <a className="section-link" href={ceremony.source} target="_blank" rel="noreferrer">
              {t("awards.officialResults")} <HiArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <ul className="awards-list">
            {ceremony.winners.map((winner, index) => {
              const category = t(`awards.categories.${getAwardCategoryKey(winner)}`, { defaultValue: winner.category });
              const people = winner.people ?? [];
              const titleFirst = !!winner.title && people.length !== 1;
              const title = winner.title && (
                <Link className={titleFirst ? "award-winner" : "award-title muted"} to={getAwardTitlePath(winner.title)}>
                  {winner.title.name}
                </Link>
              );
              return (
                <li key={`${winner.category}/${index}`} className="award-row">
                  <div className="muted text-sm">
                    {winner.source
                      ? <a className="award-category-link" href={winner.source} target="_blank" rel="noreferrer">{category}</a>
                      : category}
                  </div>
                  <div>
                    {titleFirst && title}
                    {people.length > 0 && (
                      <div className={titleFirst ? "award-people muted text-sm" : "award-people font-semibold"}>
                        {people.map((person, place) => (
                          <span key={`${person.name}/${place}`}>
                            <Link className="award-category-link" to={getAwardPersonPath(person)}>{person.name}</Link>
                            {place < people.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    )}
                    {!titleFirst && title}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};
