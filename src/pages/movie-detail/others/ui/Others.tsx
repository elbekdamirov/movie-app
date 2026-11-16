import { CastView } from "@/entities/cast";
import type { MediaType } from "@/entities/movie";
import { memo } from "react";
import { useOutletContext } from "react-router-dom";

export const Others = memo(() => {
  const { id, type } = useOutletContext<{ id: string; type: MediaType }>();
  return <CastView type="crew" id={id} mediaType={type} />;
});
