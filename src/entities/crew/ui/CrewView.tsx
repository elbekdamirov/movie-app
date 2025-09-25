import { memo } from "react";
import { useCrew } from "../model/useCrew";
import { useParams } from "react-router-dom";
import { createImageUrl } from "@/shared/utils";

export const CrewView = memo(() => {
  const { id } = useParams();
  const { getCrewById } = useCrew();
  const { data } = getCrewById(id as string);
  console.log(data);

  if (!data) {
    return <div className="container py-10 text-center">No data found</div>;
  }

  return (
    <div className="container grid md:grid-cols-3 gap-8 py-10">
      <div className="flex justify-center">
        {data.profile_path ? (
          <img
            src={createImageUrl(data.profile_path)}
            alt={data.name}
            className="rounded-2xl shadow-lg max-h-150"
          />
        ) : (
          <div className="w-72 h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-2xl">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <p className="text-gray-500">{data.known_for_department}</p>

          {data.also_known_as?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.also_known_as.map((alias: string) => (
                <span
                  key={alias}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  {alias}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Birthday:</span>{" "}
            {data.birthday || "Unknown"}
          </p>
          {data.deathday && (
            <p>
              <span className="font-semibold">Deathday:</span> {data.deathday}
            </p>
          )}
          <p>
            <span className="font-semibold">Place of Birth:</span>{" "}
            {data.place_of_birth || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Popularity:</span>{" "}
            {data.popularity?.toFixed(1)}
          </p>
          {data.homepage && (
            <p>
              <span className="font-semibold">Homepage:</span>{" "}
              <a
                href={data.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {data.homepage}
              </a>
            </p>
          )}
          {data.imdb_id && (
            <p>
              <span className="font-semibold">IMDb:</span>{" "}
              <a
                href={`https://www.imdb.com/name/${data.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Profile
              </a>
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Biography</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {data.biography || "No biography available."}
          </p>
        </div>
      </div>
    </div>
  );
});
