import { useMovie } from "@/entities/movie";
import { MovieFilter } from "@/features/movie-filter";
import { MoviePagination } from "@/features/movie-pagination";
import { MovieSort } from "@/features/movie-sort";
import { MovieList } from "@/widgets/movie-list";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";

export const Movie = memo(() => {
  const { getMovies } = useMovie();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const sort_by = searchParams.get("sort_by") ?? "popularity.desc";
  const with_genres = searchParams.get("with_genres") ?? "";

  const { data } = getMovies({ page: page as string, sort_by, with_genres });

  return (
    <div className="py-6">
      <div className="container space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Total: {data?.total_results?.toLocaleString()}
          </h2>
          <div className="flex gap-4">
            <MovieSort />
            <MovieFilter />
          </div>
        </div>
        <MovieList movies={data?.results} />
        <div className="flex justify-center pt-4">
          <MoviePagination page={page} total_pages={data?.total_pages} />
        </div>
      </div>
    </div>
  );
});
