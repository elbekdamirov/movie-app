import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getMediaPath, type IMovie } from "./types";

const loadFromLocalStorage = (): IMovie[] => {
  try {
    const data = JSON.parse(localStorage.getItem("bookmarks") ?? "[]");
    return Array.isArray(data)
      ? data.filter((movie) => typeof movie?.id === "number" && typeof movie.title === "string")
      : [];
  } catch {
    return [];
  }
};

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState: { saved: loadFromLocalStorage() },
  reducers: {
    toggleBookmark: (state, { payload }: PayloadAction<IMovie>) => {
      const path = getMediaPath(payload);
      const index = state.saved.findIndex((movie) => getMediaPath(movie) === path);
      if (index >= 0) state.saved.splice(index, 1);
      else state.saved.push(payload);

      try {
        localStorage.setItem("bookmarks", JSON.stringify(state.saved));
      } catch {
        // The current session keeps its bookmarks when storage is unavailable.
      }
    },
  },
});

export const { toggleBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
