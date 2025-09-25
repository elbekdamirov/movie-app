import { memo, type FC } from "react";
import { useMovie } from "@/entities/movie";

interface IReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

interface Props {
  id: string;
}

export const ReviewView: FC<Props> = memo(({ id }) => {
  const { getMovieInfo } = useMovie();
  const { data: reviews } = getMovieInfo(id, "reviews");

  return (
    <section className="container py-6 space-y-4">
      <h2 className="text-2xl font-semibold">Reviews</h2>
      {reviews?.results?.map((review: IReview) => (
        <div
          key={review.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900"
        >
          <p className="text-sm text-gray-500">
            By <span className="font-medium">{review.author}</span> •{" "}
            {new Date(review.created_at).toLocaleDateString()}
          </p>
          <p className="mt-2 text-gray-800 dark:text-gray-200 line-clamp-5">
            {review.content}
          </p>
        </div>
      ))}
    </section>
  );
});
