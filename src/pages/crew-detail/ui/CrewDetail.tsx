import { CrewView, useCrew } from "@/entities/crew";
import { MovieList } from "@/widgets/movie-list";
import { memo } from "react";
import { useParams } from "react-router-dom";

export const CrewDetail = memo(() => {
  const { id } = useParams();
  const { getCrewMovieById } = useCrew();
  const { data: movies } = getCrewMovieById(id as string);

  return (
    <div>
      <CrewView />
      <MovieList movies={movies?.cast} />
    </div>
  );
});
