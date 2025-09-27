import { memo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { MovieCard } from "@/entities/movie";
export const BookMark = memo(() => {
  const saved = useSelector((state: RootState) => state.bookmarks.saved);
  if (!saved.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg dark:text-white text-gray-600">
          Bookmark is empty
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Bookmarks</h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
        {saved.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
});
