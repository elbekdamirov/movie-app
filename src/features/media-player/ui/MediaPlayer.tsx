import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useStore } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { getMediaPath, useSeason, type ISeason } from "@/entities/movie";
import {
  finishWatching, isEpisodeSelection, saveWatchProgress,
  type EpisodeSelection, type PlaybackPosition, type WatchMedia,
} from "@/entities/movie/model/watchProgressSlice";
import { StatusMessage } from "@/shared/ui";
import { createPlaybackTracker, getEmbedUrl, playerOrigin } from "../model/playbackProgress";
import { usePlayerFullscreen } from "../model/usePlayerFullscreen";
import { EpisodeChooser } from "./EpisodeChooser";

interface FrameProps {
  media: WatchMedia;
  playback: PlaybackPosition;
  onEpisodeChange?: (selection: EpisodeSelection, internal: boolean) => void;
}

interface PlayerMessage {
  type?: string;
  currentTime?: unknown;
  duration?: unknown;
  source?: unknown;
  internalNavigation?: unknown;
}

const PlayerFrame = ({ media, playback, onEpisodeChange }: FrameProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const iframe = useRef<HTMLIFrameElement>(null);
  const [attempt, setAttempt] = useState(() => ({ src: getEmbedUrl(media.id, playback), number: 0 }));
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [tracker] = useState(() => createPlaybackTracker(
    playback,
    (sample) => dispatch(saveWatchProgress({ ...media, ...sample })),
    (episode) => dispatch(finishWatching({ id: media.id, media_type: media.media_type, episode })),
  ));

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      const frame = iframe.current?.contentWindow;
      if (!frame || event.origin !== playerOrigin || event.source !== frame) return;
      if (!event.data || typeof event.data !== "object") return;
      const message = event.data as PlayerMessage;

      if (message.type === "cinesrc:ready" || message.type === "cinesrc:play") setStatus("ready");
      if (message.type === "cinesrc:error") setStatus("error");
      if (message.type === "cinesrc:play") tracker.play();
      if (message.type === "cinesrc:pause") tracker.flush();
      if (message.type === "cinesrc:ended") tracker.end();
      if (message.type === "cinesrc:timeupdate" || message.type === "cinesrc:seeked") {
        tracker.update(message.currentTime, message.duration, message.type === "cinesrc:seeked");
      }
      if (onEpisodeChange && message.type === "cinesrc:nextepisode" && isEpisodeSelection(message)) {
        const { season, episode, source, internalNavigation } = message;
        tracker.switchEpisode({ season, episode }, source === "auto" || source === "up-next");
        onEpisodeChange({ season, episode }, internalNavigation === true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onEpisodeChange, tracker]);

  useEffect(() => {
    const saveIfHidden = () => {
      if (document.visibilityState === "hidden") tracker.flush();
    };
    window.addEventListener("pagehide", tracker.flush);
    document.addEventListener("visibilitychange", saveIfHidden);
    return () => {
      window.removeEventListener("pagehide", tracker.flush);
      document.removeEventListener("visibilitychange", saveIfHidden);
      tracker.flush();
    };
  }, [tracker]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("error"), 20000);
    return () => window.clearTimeout(timer);
  }, [attempt, status]);

  return (
    <div className="player-frame">
      {status === "error" ? (
        <StatusMessage
          message={t("media.playbackError")}
          onRetry={() => {
            setAttempt((current) => ({ src: getEmbedUrl(media.id, tracker.cursor()), number: current.number + 1 }));
            setStatus("loading");
          }}
        />
      ) : (
        <>
          <iframe
            ref={iframe}
            key={attempt.number}
            className="size-full border-0"
            title={media.title}
            src={attempt.src}
            allow={onEpisodeChange ? "autoplay; picture-in-picture; fullscreen 'none'" : "autoplay; fullscreen; picture-in-picture"}
            allowFullScreen={!onEpisodeChange}
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            onError={() => setStatus("error")}
          />
          {status === "loading" && <span className="player-loading" role="status">{t("media.loadingPlayer")}</span>}
        </>
      )}
    </div>
  );
};

const EpisodePlayer = ({ media, seasons, initialPlayback }: {
  media: WatchMedia;
  seasons: ISeason[];
  initialPlayback?: PlaybackPosition;
}) => {
  const { t } = useTranslation();
  const { player, fullscreen, expanded, toggle } = usePlayerFullscreen();
  const [selection, setSelection] = useState(() => {
    if (initialPlayback?.episode && seasons.some((season) => season.season_number === initialPlayback.episode?.season)) {
      return { ...initialPlayback.episode, position: initialPlayback.position, revision: 0 };
    }
    const season = seasons.find((item) => item.season_number > 0) ?? seasons[0];
    return { season: season.season_number, episode: 0, position: 0, revision: 0 };
  });
  const [playing, setPlaying] = useState<PlaybackPosition>();
  const { data, isPending, isError, refetch } = useSeason(media.id, selection.season);
  const episodes = data?.episodes ?? [];
  const selectedEpisode = episodes.find((episode) => episode.episode_number === selection.episode)
    ?? episodes[0];
  const playback = playing ?? (selectedEpisode && {
    episode: { season: selection.season, episode: selectedEpisode.episode_number },
    position: selectedEpisode.episode_number === selection.episode ? selection.position : 0,
  });

  const selectEpisode = (episode: EpisodeSelection) => {
    setPlaying(undefined);
    setSelection((current) => ({ ...episode, position: 0, revision: current.revision + 1 }));
  };

  const current = { season: selection.season, episode: selectedEpisode?.episode_number ?? selection.episode };

  return (
    <div ref={player} className={`tv-playback${expanded ? " tv-playback--expanded" : ""}`}>
      <EpisodeChooser
        id={media.id}
        seasons={seasons}
        current={current}
        episodeName={selectedEpisode?.name}
        fullscreen={fullscreen}
        onFullscreen={() => void toggle()}
        onSelect={(next) => {
          if (next.season !== current.season || next.episode !== current.episode || !playback) selectEpisode(next);
        }}
      />
      {isError && (
        <StatusMessage message={t("media.episodeError")} onRetry={() => void refetch()} />
      )}
      {playback && (
        <PlayerFrame
          key={selection.revision}
          playback={playback}
          media={media}
          onEpisodeChange={(episode, internal) => {
            if (!internal) return selectEpisode(episode);
            setPlaying(playback);
            setSelection((current) => ({ ...current, ...episode, position: 0 }));
          }}
        />
      )}
      {!isPending && !isError && !playback && <StatusMessage message={t("media.noEpisodes")} />}
    </div>
  );
};

export const MediaPlayer = ({ media, seasons, resume, initialEpisode }: {
  media: WatchMedia;
  seasons: ISeason[];
  resume: boolean;
  initialEpisode?: EpisodeSelection;
}) => {
  const store = useStore<RootState>();
  // Take the startup position once so recording progress cannot reload the active player.
  const [saved] = useState(() => resume
    ? store.getState().watchProgress.saved.find((item) =>
        getMediaPath(item) === getMediaPath(media)
        && (!initialEpisode || (item.episode?.season === initialEpisode.season && item.episode.episode === initialEpisode.episode)))
    : undefined);

  return media.media_type === "tv"
    ? <EpisodePlayer media={media} seasons={seasons} initialPlayback={saved ?? (initialEpisode && { episode: initialEpisode, position: 0 })} />
    : <PlayerFrame media={media} playback={saved ?? { position: 0 }} />;
};
