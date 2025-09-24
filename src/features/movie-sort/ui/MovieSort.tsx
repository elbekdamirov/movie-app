import { Select, ConfigProvider, theme } from "antd";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";

export const MovieSort = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();

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
        placeholder="Sort by"
        allowClear
        onChange={handleChange}
        options={[
          { value: "popularity.desc", label: "Popularity (High to Low)" },
          { value: "popularity.asc", label: "Popularity (Low to High)" },
          { value: "vote_average.desc", label: "Rating (High to Low)" },
          { value: "vote_average.asc", label: "Rating (Low to High)" },
          { value: "vote_count.desc", label: "Vote Count (High to Low)" },
          { value: "vote_count.asc", label: "Vote Count (Low to High)" },
          {
            value: "primary_release_date.desc",
            label: "Release Date (New to Old)",
          },
          {
            value: "primary_release_date.asc",
            label: "Release Date (Old to New)",
          },
          { value: "revenue.desc", label: "Revenue (High to Low)" },
          { value: "revenue.asc", label: "Revenue (Low to High)" },
          { value: "title.asc", label: "Title (A to Z)" },
          { value: "title.desc", label: "Title (Z to A)" },
          { value: "original_title.asc", label: "Original Title (A to Z)" },
          { value: "original_title.desc", label: "Original Title (Z to A)" },
        ]}
      />
    </ConfigProvider>
  );
});
