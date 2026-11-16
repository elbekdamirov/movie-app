import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowUpRight, HiOutlineCalendarDays, HiOutlineMapPin } from "react-icons/hi2";
import { createImageUrl, createUserImageUrl } from "@/shared/utils";
import type { IPerson } from "../model/types";

export const CrewView = memo(({ person }: { person: IPerson }) => {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const department = person.known_for_department;
  const formatDate = (date: string) => new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));

  return (
    <section className="container" aria-labelledby="person-name">
      <div className="person-profile">
        <img
          src={person.profile_path ? createImageUrl(person.profile_path, "w500") : createUserImageUrl(null)}
          className="person-portrait"
          alt=""
          fetchPriority="high"
        />
        <div className="person-copy">
          {department && <p className="muted text-sm font-semibold">{t(`people.department.${department}`, { defaultValue: department })}</p>}
          <h1 id="person-name" className="page-title">{person.name}</h1>
          <div className="person-facts">
            {person.birthday && (
              <span><HiOutlineCalendarDays aria-hidden="true" /> {formatDate(person.birthday)}{person.deathday && ` – ${formatDate(person.deathday)}`}</span>
            )}
            {person.place_of_birth && <span><HiOutlineMapPin aria-hidden="true" />{person.place_of_birth}</span>}
          </div>

          {person.biography && (
            <div className="mt-5">
              <h2 className="mb-2 text-lg font-semibold">{t("people.biography")}</h2>
              <p className={`person-biography ${!expanded && person.biography.length > 425 ? "line-clamp-4" : ""}`} id="person-biography">
                {person.biography}
              </p>
              {person.biography.length > 425 && (
                <button type="button" className="section-link mt-2" aria-controls="person-biography" aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>
                  {t(expanded ? "media.readLess" : "media.readMore")}
                </button>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4">
            {/^(nm\d+)$/.test(person.imdb_id ?? "") && (
              <a className="section-link" href={`https://www.imdb.com/name/${person.imdb_id}/`} target="_blank" rel="noreferrer">
                IMDb <HiArrowUpRight aria-hidden="true" />
              </a>
            )}
            {/^(https?):\/\//.test(person.homepage ?? "") && (
              <a className="section-link" href={person.homepage!} target="_blank" rel="noreferrer">
                {t("media.website")} <HiArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});
