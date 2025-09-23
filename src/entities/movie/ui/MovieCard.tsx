import { createImageUrl } from "@/shared/utils";
import { memo, type FC } from "react";
import type { IMovie } from "../model/types";
import { useNavigate } from "react-router-dom";

interface Props {
  movie: IMovie;
}

export const MovieCard: FC<Props> = memo((props) => {
  const { movie } = props;
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-black font-medium">
      <div
        className="rounded-xl"
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        <img
          className="rounded-xl"
          src={createImageUrl(movie.poster_path)}
          alt=""
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1" title={movie.title}>
          {movie.title}
        </h3>
        <p>
          Rating: <strong className="text-py">{movie.vote_average.toFixed(2)}</strong>
        </p>
      </div>
    </div>
  );
});
