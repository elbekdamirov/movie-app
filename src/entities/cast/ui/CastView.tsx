import { memo, type FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { MediaType } from "@/entities/movie";
import { StatusMessage } from "@/shared/ui";
import { createUserImageUrl } from "@/shared/utils";
import { useCast } from "../model/useCast";

interface Props {
  id: string;
  type: "cast" | "crew";
  mediaType: MediaType;
}

export const CastView: FC<Props> = memo(({ id, type, mediaType }) => {
  const { t } = useTranslation();
  const { getCasts } = useCast();
  const { data, isPending, isError, refetch } = getCasts(id, mediaType);
  const credits = data?.[type];

  if (isPending) {
    return (
      <div className="container flex gap-3 overflow-hidden pt-5" aria-busy="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="credit-card h-52 shrink-0 bg-black/5 dark:bg-white/5 motion-safe:animate-pulse" />
        ))}
      </div>
    );
  }
  if (isError) return <StatusMessage message={t("catalog.loadError")} onRetry={() => void refetch()} />;
  if (!credits?.length) return <StatusMessage message={t("media.noCredits")} />;

  return (
    <div className="container horizontal-scroll flex gap-3 pt-5 pb-3" tabIndex={0} role="group" aria-label={t(type === "cast" ? "media.cast" : "media.crew")}>
      {credits.map((person) => (
        <Link to={`/crew/${person.id}`} className="credit-card" key={person.credit_id}>
          <img src={createUserImageUrl(person.profile_path)} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          <div className="p-3">
            <h3 className="text-sm font-semibold">{person.name}</h3>
            <p className="muted text-xs">{type === "cast" ? person.character : person.job}</p>
          </div>
        </Link>
      ))}
    </div>
  );
});
