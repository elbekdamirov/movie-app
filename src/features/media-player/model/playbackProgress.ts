import type { EpisodeSelection, PlaybackPosition } from "@/entities/movie/model/watchProgressSlice";

export const playerOrigin = "https://cinesrc.st";

export const getEmbedUrl = (id: number, { episode, position }: PlaybackPosition) => {
  const type = episode ? "tv" : "movie";
  const params = new URLSearchParams();
  if (episode) {
    params.set("s", String(episode.season));
    params.set("e", String(episode.episode));
  }
  params.set("color", "#C61F1F");
  if (position > 0) {
    params.set("t", String(position));
    params.set("continueprompt", "false");
  }
  return `${playerOrigin}/embed/${type}/${id}?${params}`;
};

type PlaybackSample = PlaybackPosition & { duration?: number };

export const createPlaybackTracker = (
  initial: PlaybackPosition,
  save: (sample: PlaybackSample) => void,
  complete: (episode?: EpisodeSelection) => void,
) => {
  let sample: PlaybackSample = { episode: initial.episode, position: initial.position };
  let pending = false;
  let lastSaved: number | undefined;
  let acceptingUpdates = true;

  const flush = () => {
    if (!pending) return;
    pending = false;
    lastSaved = Date.now();
    save(sample);
  };

  return {
    cursor: () => sample,
    flush,
    play: () => { acceptingUpdates = true; },
    update: (time: unknown, length: unknown, seeked: boolean) => {
      if (!acceptingUpdates || typeof time !== "number" || !Number.isFinite(time)) return;
      const duration = typeof length === "number" && Number.isFinite(length) && length > 0
        ? length
        : sample.duration;
      const position = Math.floor(duration ? Math.min(time, duration) : time);
      if (!Number.isSafeInteger(position) || position < 1) return;
      if (position !== sample.position || duration !== sample.duration) {
        sample = { ...sample, position, duration };
        pending = true;
      }
      if (seeked || lastSaved === undefined || Date.now() - lastSaved >= 5000) flush();
    },
    end: () => {
      if (!acceptingUpdates) return;
      pending = false;
      acceptingUpdates = false;
      complete(sample.episode);
      sample = { episode: sample.episode, position: 0 };
      lastSaved = undefined;
    },
    switchEpisode: (episode: EpisodeSelection, finished: boolean) => {
      if (sample.episode?.season === episode.season && sample.episode?.episode === episode.episode) return;
      if (finished) {
        complete(sample.episode);
      } else {
        flush();
      }
      sample = { episode, position: 0 };
      pending = false;
      lastSaved = undefined;
      acceptingUpdates = false;
    },
  };
};
