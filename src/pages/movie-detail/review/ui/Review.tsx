import { ReviewView } from "@/entities/review";
import type { MediaType } from "@/entities/movie";
import { memo } from "react";
import { useOutletContext } from "react-router-dom";

export const Review = memo(() => {
  const { id, type } = useOutletContext<{ id: string; type: MediaType }>();
  return <ReviewView id={id} mediaType={type} />;
});
