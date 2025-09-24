import { Select, ConfigProvider, theme } from "antd";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovie, type IGenre } from "@/entities/movie";

export const MovieFilter = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getGenres } = useMovie();
  const { data } = getGenres();

  const selectedGenre = searchParams.get("with_genres") ?? undefined;

  const handleChange = (value: string | undefined) => {
    if (value) {
      searchParams.set("with_genres", value);
    } else {
      searchParams.delete("with_genres");
    }
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
        placeholder="Filter by genre"
        value={selectedGenre}
        onChange={handleChange}
        allowClear
        options={data?.genres?.map((g: IGenre) => ({
          value: String(g.id),
          label: g.name,
        }))}
      />
    </ConfigProvider>
  );
});
