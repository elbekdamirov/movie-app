import { useEffect, useRef, useState } from "react";

export const usePlayerFullscreen = () => {
  const player = useRef<HTMLDivElement>(null);
  const [native, setNative] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sync = () => setNative(player.current !== null && document.fullscreenElement === player.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) setExpanded(false);
    };
    document.addEventListener("keydown", exitOnEscape);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", exitOnEscape);
    };
  }, [expanded]);

  const toggle = async () => {
    const element = player.current;
    if (!element) return;
    if (document.fullscreenElement === element) {
      await document.exitFullscreen().catch(() => {});
    } else if (expanded) {
      setExpanded(false);
    } else {
      if (document.fullscreenEnabled && typeof element.requestFullscreen === "function") {
        try {
          await element.requestFullscreen();
          return;
        } catch {
          // Some embedded browsers block native fullscreen.
        }
      }
      if (element.isConnected) setExpanded(true);
    }
  };

  return { player, fullscreen: native || expanded, expanded, toggle };
};
