import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoArrowUpRight } from "react-icons/go";
import { createUserImageUrl } from "@/shared/utils";
import type { IPersonSummary } from "../model/types";

export const PersonCard = ({ person }: { person: IPersonSummary }) => {
  const { t } = useTranslation();
  const knownFor = [...new Set(person.known_for?.map((item) => item.title || item.name).filter(Boolean))].slice(0, 3).join(" · ");
  const department = person.known_for_department;
  return (
    <article className="media-card">
      <Link to={`/crew/${person.id}`} className="block h-full rounded-[15px] focus-visible:outline-offset-[-3px]">
        <div className="person-card-photo">
          <img
            data-placeholder={!person.profile_path || undefined}
            src={createUserImageUrl(person.profile_path, "h632")}
            alt=""
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="break-words font-semibold leading-tight">{person.name}</h3>
            <GoArrowUpRight className="size-4 shrink-0 text-py" aria-hidden="true" />
          </div>
          {department && (
            <p className="muted mt-1 text-xs">{t(`people.department.${department}`, { defaultValue: department })}</p>
          )}
          {knownFor && <p className="muted mt-2 line-clamp-2 text-xs" title={knownFor}>{knownFor}</p>}
        </div>
      </Link>
    </article>
  );
};
