import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiArrowsPointingIn, HiArrowsPointingOut, HiOutlineQueueList } from "react-icons/hi2";
import { useSeason, type ISeason } from "@/entities/movie";
import type { EpisodeSelection } from "@/entities/movie/model/watchProgressSlice";
import { AppSelect, StatusMessage } from "@/shared/ui";
import { createImageUrl } from "@/shared/utils";

type EpisodeChooserProps = {
  id: number;
  seasons: ISeason[];
  current: EpisodeSelection;
  episodeName?: string;
  onSelect: (episode: EpisodeSelection) => void;
};

const EpisodeMenu = ({ id, seasons, current, onSelect }: EpisodeChooserProps) => {
  const { t } = useTranslation();
  const [season, setSeason] = useState(current.season);
  const { data, isPending, isError, refetch } = useSeason(id, season);

  return (
    <>
      <div className="episode-menu-season">
        <AppSelect<number>
          aria-label={t("media.season")}
          popupMatchSelectWidth
          getPopupContainer={(trigger) => trigger.parentElement ?? document.body}
          value={season}
          onChange={setSeason}
          options={seasons.map(({ season_number, name }) => ({ value: season_number, label: name }))}
        />
      </div>
      {isPending && <p className="muted px-3 py-4 text-sm" role="status">{t("catalog.loading")}</p>}
      {isError && !data && <StatusMessage message={t("media.episodeError")} onRetry={() => void refetch()} />}
      {data && (
        data.episodes.length ? (
          <ul className="episode-menu-list">
            {data.episodes.map(({ id, episode_number, name, still_path }) => {
              const active = current.season === season && current.episode === episode_number;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={active || undefined}
                    className="episode-menu-option"
                    onClick={() => onSelect({ season, episode: episode_number })}
                  >
                    {still_path && <img className="episode-menu-still" src={createImageUrl(still_path, "w185")} alt="" loading="lazy" />}
                    <span className="min-w-0">
                      <span className="episode-menu-number">{t("media.episodeShort", { number: episode_number })}</span>{" "}
                      {name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : <StatusMessage message={t("media.noEpisodes")} />
      )}
    </>
  );
};

export const EpisodeChooser = ({ episodeName, fullscreen, onFullscreen, ...props }: EpisodeChooserProps & {
  fullscreen: boolean;
  onFullscreen: () => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };

  return (
    <div className="episode-toolbar" ref={root} onKeyDown={(event) => {
      if (event.key === "Escape" && open && !event.defaultPrevented) {
        event.stopPropagation();
        close();
      }
    }}>
      <p className="episode-now-playing" aria-live="polite">
        {props.current.episode > 0 && (
          <span className="episode-now-number">{t("media.resumeEpisode", { ...props.current })}</span>
        )}
        {episodeName && <>{" "}<span className="truncate">{episodeName}</span></>}
      </p>
      <div className="episode-toolbar-actions">
        <button
          ref={toggle}
          type="button"
          className="episode-menu-toggle"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen((value) => !value)}
        >
          <HiOutlineQueueList aria-hidden="true" />
          {t("media.episodes")}
        </button>
        <button
          type="button"
          className="episode-menu-toggle episode-fullscreen-toggle"
          aria-label={t(fullscreen ? "media.exitFullscreen" : "media.fullscreen")}
          title={t(fullscreen ? "media.exitFullscreen" : "media.fullscreen")}
          onClick={onFullscreen}
        >
          {fullscreen ? <HiArrowsPointingIn aria-hidden="true" /> : <HiArrowsPointingOut aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <div id={menuId} className="episode-menu" role="region" aria-label={t("media.episodes")}>
          <EpisodeMenu {...props} onSelect={(episode) => {
            props.onSelect(episode);
            close();
          }} />
        </div>
      )}
    </div>
  );
};
