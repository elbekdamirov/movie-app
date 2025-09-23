import { useMovie } from "@/entities/movie";
import { Hero } from "@/widgets/hero";
import { MovieList } from "@/widgets/movie-list";
import { memo } from "react";

export const Home = memo(() => {
  const { getMovies } = useMovie();
  const { data } = getMovies();

  return (
    <div className="">
      <Hero movies={data?.results?.slice(0, 6)} />
      <MovieList movies={data?.results?.slice(0, 8)} />
    </div>
  );
});
