import { configureStore } from "@reduxjs/toolkit";
import bookmarkSlice from "@/entities/movie/model/bookmarkSlice";
import watchProgressSlice, { persistWatchProgress } from "@/entities/movie/model/watchProgressSlice";
import { authSlice } from "@/features/auth";
export const store = configureStore({
  reducer: {
    bookmarks: bookmarkSlice,
    watchProgress: watchProgressSlice,
    auth: authSlice.reducer,
  },
});

let savedProgress = store.getState().watchProgress.saved;
store.subscribe(() => {
  const { saved } = store.getState().watchProgress;
  if (saved === savedProgress) return;
  savedProgress = saved;
  persistWatchProgress(saved);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
