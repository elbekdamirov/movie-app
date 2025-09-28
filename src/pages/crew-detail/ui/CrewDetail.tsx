import { CrewView, useCrew } from "@/entities/crew";
import { Title } from "@/shared/ui/title/Title";
import { MovieList } from "@/widgets/movie-list";
import { memo, useState } from "react";
import { useParams } from "react-router-dom";

export const CrewDetail = memo(() => {
  const { id } = useParams();
  const { getCrewMovieById } = useCrew();
  const { data: movies, isLoading } = getCrewMovieById(id as string);

  const [showAll, setShowAll] = useState(false);

  const displayedMovies = showAll ? movies?.cast : movies?.cast.slice(0, 8);

  return (
    <div>
      <CrewView />
      <Title className="container py-7">Appeared in</Title>
      <MovieList movies={displayedMovies} loading={isLoading} />

      {!showAll && movies?.cast.length > 8 && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
});
