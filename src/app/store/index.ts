import { configureStore } from "@reduxjs/toolkit";
import bookmarkSlice from "@/entities/movie/model/bookmarkSlice";
import { authSlice } from "@/features/auth";
export const store = configureStore({
  reducer: {
    bookmarks: bookmarkSlice,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
