import { MovieCard, type IMovie } from "@/entities/movie";
import { memo, type FC } from "react";

interface Props {
  movies?: IMovie[];
  loading: boolean;
}

export const MovieList: FC<Props> = memo(({ movies = [], loading }) => {
  return (
    <div className="container grid lg:grid-cols-4 gap-3 md:grid-cols-3 grid-cols-2 py-15">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <MovieCard key={i} loading />)
        : movies.map((item: IMovie) => (
            <MovieCard key={item.id} movie={item} />
          ))}
    </div>
  );
});
