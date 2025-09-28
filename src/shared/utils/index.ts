import defaultImage from "@/shared/assets/default-image.jpg";
import defaultUser from "@/shared/assets/defaultUser.png";

export const createImageUrl = (path: string | null) => {
  if (path) {
    return `https://image.tmdb.org/t/p/original${path}`;
  }
  return defaultImage;
};

export const createUserImageUrl = (path: string | null) => {
  if (path) {
    return `https://image.tmdb.org/t/p/original${path}`;
  }
  return defaultUser;
};
