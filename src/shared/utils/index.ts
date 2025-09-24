import defaultImage from "@/shared/assets/default-image.jpg";

export const createImageUrl = (path: string | null) => {
  if (path) {
    return `https://image.tmdb.org/t/p/original${path}`;
  }
  return defaultImage;
};
