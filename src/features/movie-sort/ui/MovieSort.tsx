import { AppSelect } from "@/shared/ui";
import type { MediaType } from "@/entities/movie";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const MovieSort = memo(({ type = "movie" }: { type?: MediaType }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const label = t("movieSort.placeholder");
  const date = type === "tv" ? "first_air_date" : "primary_release_date";
  const options = [
    ["popularity.desc", "popularityDesc"],
    ["popularity.asc", "popularityAsc"],
    ["vote_average.desc", "ratingDesc"],
    ["vote_average.asc", "ratingAsc"],
    ["vote_count.desc", "voteCountDesc"],
    ["vote_count.asc", "voteCountAsc"],
    [`${date}.desc`, "releaseDateDesc"],
    [`${date}.asc`, "releaseDateAsc"],
    ...(type === "movie" ? [
      ["revenue.desc", "revenueDesc"],
      ["revenue.asc", "revenueAsc"],
      ["title.asc", "titleAsc"],
      ["title.desc", "titleDesc"],
      ["original_title.asc", "originalTitleAsc"],
      ["original_title.desc", "originalTitleDesc"],
    ] : [
      ["name.asc", "titleAsc"],
      ["name.desc", "titleDesc"],
    ]),
  ];

  const handleChange = (value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("sort_by", value);
    else next.delete("sort_by");
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <AppSelect
      aria-label={label}
      className="catalog-select"
      placeholder={label}
      value={searchParams.get("sort_by") || undefined}
      onChange={handleChange}
      allowClear
      options={options.map(([value, key]) => ({ value, label: t(`movieSort.options.${key}`) }))}
    />
  );
});
