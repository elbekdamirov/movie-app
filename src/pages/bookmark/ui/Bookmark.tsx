import { memo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { MovieCard, type IMovie } from "@/entities/movie";
import { FaRegBookmark } from "react-icons/fa";
import { useMovie } from "@/entities/movie";
import { useTranslation } from "react-i18next";

export const BookMark = memo(() => {
  const saved = useSelector((state: RootState) => state.bookmarks.saved);
  const { getMovies } = useMovie();
  const { data, isLoading } = getMovies();
  const { t } = useTranslation();

  if (!saved.length) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <FaRegBookmark className="text-5xl text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            {t("bookmarks.empty")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("bookmarks.startAdding")}
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {t("bookmarks.recommendations")}
        </h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <MovieCard key={i} loading />
              ))
            : data?.results?.map((movie: IMovie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        {t("bookmarks.title")}
      </h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
        {saved.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
});
