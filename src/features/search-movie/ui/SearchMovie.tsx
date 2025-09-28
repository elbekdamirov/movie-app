import { memo, useState, useEffect } from "react";
import { useSearchMovie } from "../model/useSearchMovie";
import { MovieList } from "@/widgets/movie-list";
import { Empty, Input } from "antd";
import useDebounce from "@/shared/hooks/useDebounce";

const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("theme");
      setIsDark(saved === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
  }, []);

  return isDark;
};

export const SearchMovie = memo(() => {
  const [value, setValue] = useState("");
  const { getMovieBySearch } = useSearchMovie();
  const debounceValue = useDebounce(value, 800);
  const { data, isFetching } = getMovieBySearch({ query: debounceValue });
  const isDark = useTheme();

  const showEmpty = !data?.results?.length && debounceValue && !isFetching;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for a movie..."
            size="large"
            className={`transition-all duration-300 ${
              isDark
                ? "!bg-gray-900 !border-gray-700 !text-white placeholder:!text-gray-400 focus:!border-gray-600"
                : "!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-500 focus:!border-blue-500"
            }`}
            style={{
              backgroundColor: isDark ? "#111827" : "#ffffff",
              borderColor: isDark ? "#374151" : "#d1d5db",
              color: isDark ? "#ffffff" : "#111827",
            }}
          />
        </div>

        <div className="mb-6">
          <MovieList movies={data?.results} loading={isFetching} />
        </div>

        {showEmpty && (
          <div className="flex flex-col items-center justify-center py-20">
            <Empty
              description={
                <span
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No movies found for "{debounceValue}"
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              imageStyle={{
                filter: isDark
                  ? "invert(1) grayscale(100%)"
                  : "grayscale(100%)",
                opacity: 0.7,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});
