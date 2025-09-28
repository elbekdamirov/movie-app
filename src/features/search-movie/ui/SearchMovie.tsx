import { memo, useState } from "react";
import { useSearchMovie } from "../model/useSearchMovie";
import { MovieList } from "@/widgets/movie-list";
import { Empty, Input } from "antd";
import useDebounce from "@/shared/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { MdMovie } from "react-icons/md";

export const SearchMovie = memo(() => {
  const [value, setValue] = useState("");
  const { getMovieBySearch } = useSearchMovie();
  const debounceValue = useDebounce(value, 800);
  const { data, isFetching } = getMovieBySearch({ query: debounceValue });
  const { t } = useTranslation();

  const showEmpty = !data?.results?.length && debounceValue && !isFetching;
  const showPlaceholder = !value.trim();

  return (
    <div className="min-h-[54vh]">
      <div className="container">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("search.placeholder")}
          className="search-movie-input"
        />
        <br />
        <br />
      </div>

      {showPlaceholder ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
          <MdMovie className="text-6xl mb-4 opacity-70" />
          <span className="text-lg font-medium">{t("search.startTyping")}</span>
        </div>
      ) : (
        <>
          <MovieList movies={data?.results} loading={isFetching} />
          {showEmpty && (
            <div className="flex flex-col items-center justify-center py-20">
              <Empty
                description={
                  <span className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    {t("search.noResults")}
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ filter: "grayscale(100%)", opacity: 0.7 }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
});
