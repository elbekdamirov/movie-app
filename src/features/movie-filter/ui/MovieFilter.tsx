import { AppSelect } from "@/shared/ui";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovie, type MediaType } from "@/entities/movie";
import { useTranslation } from "react-i18next";

export const MovieFilter = memo(({ type = "movie" }: { type?: MediaType }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getGenres } = useMovie();
  const { data } = getGenres(type);
  const { t } = useTranslation();
  const label = t("FilterGenre");

  const handleChange = (value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("with_genres", value);
    else next.delete("with_genres");
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <AppSelect
      aria-label={label}
      className="catalog-select col-span-2"
      placeholder={label}
      value={searchParams.get("with_genres") || undefined}
      onChange={handleChange}
      allowClear
      options={data?.genres.map((genre) => ({
        value: String(genre.id),
        label: t(`genres.${genre.id}`, { defaultValue: genre.name }),
      }))}
    />
  );
});
