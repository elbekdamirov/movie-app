import { createImageUrl } from "@/shared/utils";
import { memo, type FC } from "react";
import type { IMovie } from "../model/types";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { toggleBookmark } from "../model/bookmarkSlice";

interface Props {
  movie: IMovie;
}

export const MovieCard: FC<Props> = memo(({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector((state: RootState) => state.bookmarks.saved);

  const isSaved = saved.some((m) => m.id === movie.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleBookmark(movie));
  };

  return (
    <div className="bg-white dark:bg-black font-medium relative">
      <div
        className="rounded-xl cursor-pointer relative"
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        <img
          className="rounded-xl"
          src={createImageUrl(movie.poster_path)}
          alt={movie.title}
        />

        <button
          onClick={handleBookmark}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isSaved
              ? "bg-black/60 text-py"
              : "bg-black/60 hover:bg-black/80 text-white"
          }`}
        >
          {isSaved ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
        </button>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1" title={movie.title}>
          {movie.title}
        </h3>
        <p>{new Date(movie.release_date ?? "").getFullYear() || "N/A"}</p>
        <p>
          Rating:{" "}
          <strong className="text-py">
            {movie.vote_average ? movie.vote_average.toFixed(2) : "N/A"}
          </strong>
        </p>
      </div>
    </div>
  );
});
