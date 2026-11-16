import defaultImage from "@/shared/assets/default-image.jpg";
import defaultUser from "@/shared/assets/defaultUser.png";

export const createImageUrl = (path?: string | null, size = "original") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : defaultImage;

export const createUserImageUrl = (path?: string | null, size = "w185") => {
  if (path?.startsWith("/https://")) return path.slice(1);
  if (path?.startsWith("https://")) return path;
  return path ? createImageUrl(path, size) : defaultUser;
};

export const getReleaseYear = (date?: string) => date?.match(/^\d{4}/)?.[0];
