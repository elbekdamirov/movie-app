import axios from "axios";

export const imdbRatingEnabled = Boolean(import.meta.env.VITE_OMDB_API_KEY);

export const fetchImdbRating = async (id: string, signal: AbortSignal) => {
  const { data } = await axios.get<{ Response: string; imdbRating?: string }>("https://www.omdbapi.com/", {
    params: { i: id, apikey: import.meta.env.VITE_OMDB_API_KEY },
    signal,
    timeout: 5000,
  });
  const rating = Number(data.imdbRating);
  return data.Response === "True" && Number.isFinite(rating) && rating > 0 && rating <= 10 ? rating : null;
};
