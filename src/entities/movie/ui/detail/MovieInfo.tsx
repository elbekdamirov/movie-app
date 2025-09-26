import { memo, type FC } from "react";
import { useMovie } from "../../model/useMovie";
import { createImageUrl } from "@/shared/utils";
import { Image } from "antd";
import { Title } from "@/shared/ui/title/Title";
import { Link } from "react-router-dom";

interface Props {
  id: string;
}

export const MovieInfo: FC<Props> = memo(({ id }) => {
  const { getMovieById, getMovieInfo } = useMovie();
  const { data } = getMovieById(id);
  const { data: imageData } = getMovieInfo(id, "images");

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
              preview={true}
            />
          ))}
      </section>

      <section className="container mt-10">
        <Title>Tabs</Title>
        <div className="flex gap-4">
          <Link to={""}>Review</Link>
          <Link to={"cast"}>Cast</Link>
          <Link to={"others"}>Others</Link>
        </div>
      </section>
    </div>
  );
});
