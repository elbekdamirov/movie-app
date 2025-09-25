import { memo, type FC } from "react";
import { useCast } from "../model/useCast";
import { createImageUrl } from "@/shared/utils";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  type: string;
}

export const CastView: FC<Props> = memo((props) => {
  const { id, type } = props;
  const { getCasts } = useCast();
  const { data } = getCasts(id);
  const navigate = useNavigate();

  return (
    <div className="container flex overflow-x-auto cursor-pointer">
      {data &&
        data[type]?.map((item: any, index: number) => (
          <div
            onClick={()=> navigate(`/crew/${item.id}`)}
            key={index}
            className="mt-5 p-4 rounded-2xl
                       bg-white dark:bg-gray-950 
                       hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <img
              className="min-w-[150px] rounded-2xl"
              src={createImageUrl(item.profile_path)}
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
