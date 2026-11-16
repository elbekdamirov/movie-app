import { AppSelect } from "@/shared/ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const currentYear = Math.max(2025, new Date().getFullYear());
const yearRanges = [
  { value: "1800-1899", label: "1800s" },
  { value: "1900-1949", label: "1900–1949" },
  { value: "1950-1979", label: "1950–1979" },
  { value: "1980-1999", label: "1980–1999" },
  { value: "2000-2010", label: "2000–2010" },
  { value: "2011-2020", label: "2011–2020" },
  { value: `2021-${currentYear}`, label: `2021–${currentYear}` },
];

export const MovieFilterYear = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const label = t("movie_year_sort.title");
  const selected = searchParams.get("year_range") || undefined;
  const options = selected && !yearRanges.some(({ value }) => value === selected)
    ? [...yearRanges, { value: selected, label: selected }]
    : yearRanges;

  const handleChange = (value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("year_range", value);
    else next.delete("year_range");
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <AppSelect
      aria-label={label}
      className="catalog-select"
      placeholder={label}
      value={selected}
      onChange={handleChange}
      allowClear
      options={options}
    />
  );
});
