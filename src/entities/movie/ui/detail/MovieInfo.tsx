import { memo, type FC } from "react";
import { useMovie } from "../../model/useMovie";
import { createImageUrl } from "@/shared/utils";
import { Image } from "antd";

interface Props {
  id: string;
}

interface IReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
}


export const MovieInfo: FC<Props> = memo(({ id }) => {
  const { getMovieById, getMovieInfo } = useMovie();
  const { data } = getMovieById(id);
  const { data: imageData } = getMovieInfo(id, "images");
  const { data: reviews } = getMovieInfo(id, "reviews");

  return (
    <div>
      <section>
        {data?.backdrop_path && (
          <img
            src={createImageUrl(data.backdrop_path)}
            alt={data.title}
            className="w-full max-h-[600px] object-contain"
          />
        )}
      </section>

      <section className="container py-6 space-y-3">
        <h1 className="text-3xl font-bold">{data?.title}</h1>

        <p className="text-lg text-black dark:text-white">
          Budget: {data?.budget ? `${data.budget.toLocaleString()} USD` : "N/A"}
        </p>

        {data?.homepage && (
          <a
            href={data.homepage}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            Official Website
          </a>
        )}
      </section>

      <section className="container flex overflow-x-auto gap-2 pb-4">
        {imageData?.backdrops
          ?.slice(0, 20)
          .map((item: { file_path: string }, inx: number) => (
            <Image
              key={inx}
              className="min-w-[200px] rounded"
              src={createImageUrl(item.file_path)}
              alt={`${data?.title} backdrop ${inx + 1}`}
              preview={false}
            />
          ))}
      </section>

      {reviews?.results?.length > 0 && (
        <section className="container py-6 space-y-4">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          {reviews.results.map((review: IReview) => (
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
      )}
    </div>
  );
});
