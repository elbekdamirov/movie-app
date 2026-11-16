import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  expiresAt?: number;
}

const loadUser = (): UserProfile | null => {
  try {
    const cached = JSON.parse(localStorage.getItem("auth-user") ?? "null");
    if (!cached || typeof cached !== "object") return null;
    const expiry = cached.expiresAt ?? cached.exp;
    if (typeof expiry === "number" && expiry * 1000 <= Date.now()) return null;
    return cached;
  } catch {
    return null;
  }
};

const initialState: { user: UserProfile | null } = { user: loadUser() };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      try {
        localStorage.setItem("auth-user", JSON.stringify(action.payload));
      } catch {
        // The active session can still use its in-memory profile.
      }
    },
    logout: (state) => {
      state.user = null;
      try {
        localStorage.removeItem("auth-user");
      } catch {
        // The in-memory profile was already cleared.
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
