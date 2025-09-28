import { memo, type FC } from "react";
import { useCast } from "../model/useCast";
import { createUserImageUrl } from "@/shared/utils";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  type: string;
}

export const CastView: FC<Props> = memo((props) => {
  const { id, type } = props;
  const { getCasts } = useCast();
  const { data, isLoading } = getCasts(id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container flex overflow-x-auto gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="mt-5 p-4 rounded-2xl bg-white dark:bg-gray-950"
          >
            <div className="min-w-[150px] h-[225px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="mt-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="mt-1 h-3 w-20 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container flex overflow-x-auto gap-4 cursor-pointer">
      {data &&
        data[type]?.map((item: any, index: number) => (
          <div
            onClick={() => navigate(`/crew/${item.id}`)}
            key={index}
            className="mt-5 p-4 rounded-2xl
                       bg-white dark:bg-gray-950 
                       hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <img
              className="min-w-[150px] rounded-2xl h-50"
              src={createUserImageUrl(item.profile_path)}
              alt={item.original_name}
            />
            <h3 className="mt-2 font-medium text-gray-900 dark:text-gray-100">
              {item.original_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {type === "cast" ? item.character : item.job}
            </p>
          </div>
        ))}
    </div>
  );
});
