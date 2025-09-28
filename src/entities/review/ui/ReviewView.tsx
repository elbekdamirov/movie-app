import { memo, type FC, useState } from "react";
import { useMovie } from "@/entities/movie";
import { createUserImageUrl } from "@/shared/utils";

interface IReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    avatar_path: string | null;
    rating?: number;
  };
}

interface Props {
  id: string;
}

export const ReviewView: FC<Props> = memo(({ id }) => {
  const { getMovieInfo } = useMovie();
  const { data: reviews, isLoading } = getMovieInfo(id, "reviews");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <section className="container py-6 space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-2 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="container py-6 space-y-4">
      <h2 className="text-2xl font-semibold">Reviews</h2>
      {reviews?.results?.map((review: IReview) => {
        const isExpanded = expanded[review.id] ?? false;

        return (
          <div
            key={review.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <img
                src={createUserImageUrl(review.author_details?.avatar_path)}
                alt={review.author}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">
                  By <span className="font-medium">{review.author}</span> •{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                {review.author_details?.rating && (
                  <p className="text-xs text-yellow-600">
                    Rating: {review.author_details.rating}/10
                  </p>
                )}
              </div>
            </div>

            <p
              className={`mt-2 text-gray-800 dark:text-gray-200 ${
                isExpanded ? "" : "line-clamp-5"
              }`}
            >
              {review.content}
            </p>

            {review.content.length > 300 && (
              <button
                onClick={() => toggleExpand(review.id)}
                className="mt-2 text-red-600 hover:underline font-medium"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
});
