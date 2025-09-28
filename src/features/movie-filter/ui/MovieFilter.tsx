import { Select, ConfigProvider, theme } from "antd";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovie, type IGenre } from "@/entities/movie";
import { useTranslation } from "react-i18next";

export const MovieFilter = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getGenres } = useMovie();
  const { data } = getGenres();
  const { t } = useTranslation();

  const selectedGenre = searchParams.get("with_genres") ?? "";

  const handleChange = (value: string) => {
    if (value && value !== "") {
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
        placeholder={t("FilterGenre")}
        value={selectedGenre}
        onChange={handleChange}
        options={[
          { value: "", label: t("All") },
          ...(data?.genres?.map((g: IGenre) => ({
            value: String(g.id),
            label: t(`genres.${g.id}`),
          })) ?? []),
        ]}
      />
    </ConfigProvider>
  );
});
