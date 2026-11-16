import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getMediaPath, type IMovie } from "./types";

export type WatchMedia = Pick<IMovie, "id" | "title" | "backdrop_path" | "poster_path"> & {
  media_type: NonNullable<IMovie["media_type"]>;
};

export interface EpisodeSelection {
  season: number;
  episode: number;
}

export interface PlaybackPosition {
  episode?: EpisodeSelection;
  position: number;
}

export type WatchProgress = WatchMedia & PlaybackPosition & { duration?: number };
type WatchTarget = Pick<WatchProgress, "id" | "media_type" | "episode">;

export const isEpisodeSelection = (value: unknown): value is EpisodeSelection => {
  if (!value || typeof value !== "object") return false;
  const { season, episode } = value as Partial<EpisodeSelection>;
  return typeof season === "number" && Number.isSafeInteger(season) && season >= 0
    && typeof episode === "number" && Number.isSafeInteger(episode) && episode > 0;
};

const storageKey = "watch-progress";
const maxEntries = 30;

const isWatchProgress = (value: unknown): value is WatchProgress => {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<WatchProgress>;
  return typeof item.id === "number" && Number.isSafeInteger(item.id) && item.id > 0
    && typeof item.title === "string"
    && (item.backdrop_path === null || typeof item.backdrop_path === "string")
    && (item.poster_path === null || typeof item.poster_path === "string")
    && typeof item.position === "number" && Number.isSafeInteger(item.position) && item.position > 0
    && (item.duration === undefined || (Number.isFinite(item.duration) && item.duration >= item.position))
    && (item.media_type === "movie" ? item.episode === undefined : item.media_type === "tv" && isEpisodeSelection(item.episode));
};

const readProgress = (): WatchProgress[] => {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(data)) return [];
    const saved = new Map<string, WatchProgress>();
    for (const item of data) {
      if (isWatchProgress(item) && !saved.has(getMediaPath(item))) saved.set(getMediaPath(item), item);
      if (saved.size >= maxEntries) break;
    }
    return [...saved.values()];
  } catch {
    return [];
  }
};

export const persistWatchProgress = (saved: WatchProgress[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    // Playback history stays available in this session when storage is unavailable.
  }
};

const watchProgressSlice = createSlice({
  name: "watchProgress",
  initialState: { saved: readProgress() },
  reducers: {
    saveWatchProgress: (state, { payload }: PayloadAction<WatchProgress>) => {
      const path = getMediaPath(payload);
      state.saved = [payload, ...state.saved.filter((item) => getMediaPath(item) !== path)].slice(0, maxEntries);
    },
    removeWatchProgress: (state, { payload }: PayloadAction<Pick<WatchTarget, "id" | "media_type">>) => {
      const index = state.saved.findIndex((item) => item.id === payload.id && item.media_type === payload.media_type);
      if (index >= 0) state.saved.splice(index, 1);
    },
    finishWatching: (state, { payload }: PayloadAction<WatchTarget>) => {
      const index = state.saved.findIndex((item) =>
        getMediaPath(item) === getMediaPath(payload)
        && item.episode?.season === payload.episode?.season
        && item.episode?.episode === payload.episode?.episode,
      );
      if (index >= 0) state.saved.splice(index, 1);
    },
  },
});

export const { saveWatchProgress, removeWatchProgress, finishWatching } = watchProgressSlice.actions;
export default watchProgressSlice.reducer;
