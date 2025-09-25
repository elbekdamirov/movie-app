import { ReviewView } from "@/entities/review";
import { memo } from "react";
import { useParams } from "react-router-dom";

export const Review = memo(() => {
  const { id } = useParams();

  return (
    <div>
      <ReviewView id={id as string} />
    </div>
  );
});
