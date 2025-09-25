import { CastView } from "@/entities/cast";
import { memo } from "react";
import { useParams } from "react-router-dom";

export const Others = memo(() => {
  const { id } = useParams();

  return (
    <div>
      <CastView type="crew" id={id as string} />
    </div>
  );
});
