import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IMovie } from "@/entities/movie/model/types";

const loadFromLocalStorage = (): IMovie[] => {
  try {
    const data = localStorage.getItem("bookmarks");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

interface BookmarkState {
  saved: IMovie[];
}

const initialState: BookmarkState = {
  saved: loadFromLocalStorage(),
};

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<IMovie>) => {
      const exists = state.saved.find((m) => m.id === action.payload.id);
      if (exists) {
        state.saved = state.saved.filter((m) => m.id !== action.payload.id);
      } else {
        state.saved.push(action.payload);
      }

      localStorage.setItem("bookmarks", JSON.stringify(state.saved));
    },
  },
});

export const { toggleBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
