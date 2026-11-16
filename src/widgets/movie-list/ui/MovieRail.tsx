import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { IMovie } from "@/entities/movie";
import { MovieList } from "./MovieList";

interface HorizontalRailProps {
  children: ReactNode;
  count: number;
  label: string;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export const HorizontalRail = ({ children, count, label, loadingMore, onLoadMore }: HorizontalRailProps) => {
  const { t } = useTranslation();
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const element = track.current;
    if (!element) return;

    const updateEdges = () => {
      const remaining = element.scrollWidth - element.clientWidth - element.scrollLeft;
      const left = element.scrollLeft > 2;
      const right = remaining > 2;
      setEdges((previous) => previous.left === left && previous.right === right ? previous : { left, right });

      if (left && remaining <= element.clientWidth / 2 && !loadingMore) {
        onLoadMore?.();
      }
    };

    updateEdges();
    element.addEventListener("scroll", updateEdges, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(updateEdges);
    observer?.observe(element);
    return () => {
      element.removeEventListener("scroll", updateEdges);
      observer?.disconnect();
    };
  }, [count, loadingMore, onLoadMore]);

  const move = (direction: -1 | 1) => {
    const element = track.current;
    if (!element) return;

    if (direction === 1 && !edges.right) {
      if (!loadingMore) onLoadMore?.();
      return;
    }

    const card = element.querySelector<HTMLElement>(".movie-rail-cards > *");
    const gap = card?.parentElement ? parseFloat(getComputedStyle(card.parentElement).columnGap) : 0;
    const step = (card?.offsetWidth ?? element.clientWidth) + (gap || 0);
    const count = Math.max(1, Math.floor(element.clientWidth / step));
    element.scrollBy({
      left: direction * step * count,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div className="container movie-rail">
      <button
        type="button"
        className="movie-rail-arrow"
        aria-label={t("catalog.previousTitles", { title: label })}
        disabled={!edges.left}
        onClick={() => move(-1)}
      >
        <HiChevronLeft aria-hidden="true" />
      </button>
      <div ref={track} className="movie-rail-track" tabIndex={0} role="group" aria-label={label}>
        {children}
      </div>
      <button
        type="button"
        className="movie-rail-arrow"
        aria-label={t("catalog.nextTitles", { title: label })}
        disabled={!edges.right && (!onLoadMore || loadingMore)}
        onClick={() => move(1)}
      >
        <HiChevronRight aria-hidden="true" />
      </button>
    </div>
  );
};

type MovieRailProps = Omit<HorizontalRailProps, "children" | "count"> & {
  movies?: IMovie[];
  loading: boolean;
};

export const MovieRail = ({ movies, loading, ...rail }: MovieRailProps) => (
  <HorizontalRail {...rail} count={loading ? -1 : movies?.length ?? 0}>
    <MovieList movies={movies} loading={loading} horizontal />
  </HorizontalRail>
);
