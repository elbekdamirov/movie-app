import { configureStore } from "@reduxjs/toolkit";
import bookmarkSlice from "@/entities/movie/model/bookmarkSlice";
export const store = configureStore({
  reducer: {
    bookmarks: bookmarkSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
