import { Select, ConfigProvider, theme } from "antd";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";

export const MovieFilterYear = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYearRange = searchParams.get("year_range") ?? undefined;

  const handleChange = (value: string | undefined) => {
    if (value) {
      searchParams.set("year_range", value);
    } else {
      searchParams.delete("year_range");
    }
    setSearchParams(searchParams);
  };

  const yearRanges = [
    { value: "1800-1899", label: "1800s" },
    { value: "1900-1949", label: "1900 - 1949" },
    { value: "1950-1979", label: "1950 - 1979" },
    { value: "1980-1999", label: "1980 - 1999" },
    { value: "2000-2010", label: "2000 - 2010" },
    { value: "2011-2020", label: "2011 - 2020" },
    { value: "2021-2025", label: "2021 - 2025" },
  ];

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
        placeholder="Filter by year range"
        value={selectedYearRange}
        onChange={handleChange}
        allowClear
        options={yearRanges}
      />
    </ConfigProvider>
  );
});
