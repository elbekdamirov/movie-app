import { Select, ConfigProvider, theme } from "antd";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const MovieSort = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const handleChange = (value: string) => {
    searchParams.set("sort_by", value);
    setSearchParams(searchParams);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgElevated: "#000",
          colorText: "#fff",
          colorTextPlaceholder: "#888",
          colorPrimary: "#c61f1f",
          colorBorder: "#c61f1f",
        },
        components: {
          Select: {
            selectorBg: "#000",
            colorBorder: "#c61f1f",
            optionSelectedBg: "#c61f1f",
            optionActiveBg: "#333",
            colorPrimaryHover: "#c61f1f",
          },
        },
      }}
    >
      <Select
        className="w-60"
        placeholder={t("movieSort.placeholder")}
        allowClear
        onChange={handleChange}
        options={[
          {
            value: "popularity.desc",
            label: t("movieSort.options.popularityDesc"),
          },
          {
            value: "popularity.asc",
            label: t("movieSort.options.popularityAsc"),
          },
          {
            value: "vote_average.desc",
            label: t("movieSort.options.ratingDesc"),
          },
          {
            value: "vote_average.asc",
            label: t("movieSort.options.ratingAsc"),
          },
          {
            value: "vote_count.desc",
            label: t("movieSort.options.voteCountDesc"),
          },
          {
            value: "vote_count.asc",
            label: t("movieSort.options.voteCountAsc"),
          },
          {
            value: "primary_release_date.desc",
            label: t("movieSort.options.releaseDateDesc"),
          },
          {
            value: "primary_release_date.asc",
            label: t("movieSort.options.releaseDateAsc"),
          },
          { value: "revenue.desc", label: t("movieSort.options.revenueDesc") },
          { value: "revenue.asc", label: t("movieSort.options.revenueAsc") },
          { value: "title.asc", label: t("movieSort.options.titleAsc") },
          { value: "title.desc", label: t("movieSort.options.titleDesc") },
          {
            value: "original_title.asc",
            label: t("movieSort.options.originalTitleAsc"),
          },
          {
            value: "original_title.desc",
            label: t("movieSort.options.originalTitleDesc"),
          },
        ]}
      />
    </ConfigProvider>
  );
});
