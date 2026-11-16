import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiArrowRight, HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { createImageUrl, createUserImageUrl, getReleaseYear } from "@/shared/utils";
import useDebounce from "@/shared/hooks/useDebounce";
import type { SearchResult } from "../api/fetchApi";
import { getSearchFilter, getSearchPath, getSearchResultPath } from "../model/searchLocation";
import { useSearchMovie } from "../model/useSearchMovie";

const previewLimit = 6;

const SearchPreview = ({ result }: { result: SearchResult }) => {
  const { t } = useTranslation();
  const person = result.media_type === "person";
  const name = person ? result.name : result.title;
  const image = person ? createUserImageUrl(result.profile_path) : createImageUrl(result.poster_path, "w92");
  const label = person
    ? t(`people.department.${result.known_for_department}`, { defaultValue: result.known_for_department || t("search.people") })
    : [t(result.media_type === "tv" ? "media.series" : "media.movie"), getReleaseYear(result.release_date)].filter(Boolean).join(" · ");

  return (
    <>
      <img className={person ? "header-search-person-photo" : undefined} src={image} alt="" decoding="async" />
      <div className="header-search-result-copy">
        <span>{name}</span>
        <span className="muted">{label}</span>
      </div>
    </>
  );
};

export const HeaderSearch = ({ onOpen }: { onOpen: () => void }) => {
  const { t } = useTranslation();
  const { pathname, search, key, state } = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const isSearchPage = pathname === "/search";
  const params = new URLSearchParams(isSearchPage ? search : "");
  const filter = getSearchFilter(params.get("type"));
  const initialQuery = params.get("q") ?? "";
  const [expanded, setExpanded] = useState(isSearchPage && !initialQuery.trim());
  const [value, setValue] = useState(initialQuery);
  const [composing, setComposing] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const changed = useRef(false);
  const previousLocation = useRef(key);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const panelId = useId();
  const listId = `${panelId}-suggestions`;
  const typed = value.trim();
  const query = useDebounce(typed, 240);
  const waiting = composing || typed !== query;
  const showDropdown = expanded && !!typed;
  const { getMovieBySearch } = useSearchMovie();
  const { data, isPending, isError } = getMovieBySearch({ query, page: 1, type: filter }, showDropdown && !waiting);
  const pending = waiting || isPending;
  const results = showDropdown && !pending && !isError ? data?.results.slice(0, previewLimit) ?? [] : [];
  const active = results[highlight];
  const fullResults = getSearchPath(typed, filter);
  const currentPath = pathname + search;
  const liveSearch = state?.liveHeaderSearch === panelId && navigationType !== "POP";

  useEffect(() => {
    if (previousLocation.current === key) return;
    previousLocation.current = key;
    if (liveSearch) return;

    changed.current = false;
    setValue(initialQuery);
    setComposing(false);
    setHighlight(-1);
    setExpanded(isSearchPage && !initialQuery.trim());
  }, [key, liveSearch, initialQuery, isSearchPage]);

  useEffect(() => {
    if (!changed.current || waiting) return;
    changed.current = false;
    if ((!typed && !isSearchPage) || fullResults === currentPath) return;
    if (isSearchPage) window.scrollTo(0, 0);
    navigate(fullResults, { replace: isSearchPage, state: { liveHeaderSearch: panelId } });
  }, [waiting, typed, isSearchPage, fullResults, currentPath, navigate, panelId]);

  useEffect(() => {
    if (!expanded) return;

    field.current?.focus({ preventScroll: true });
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setExpanded(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [expanded]);

  useEffect(() => {
    if (highlight >= 0) list.current?.children[highlight]?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const close = (restoreFocus = false) => {
    setExpanded(false);
    setHighlight(-1);
    if (restoreFocus) requestAnimationFrame(() => trigger.current?.focus());
  };

  const setSearch = (next: string) => {
    changed.current = true;
    setValue(next);
    setHighlight(-1);
  };

  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }

    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && event.target === field.current && results.length) {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const start = step === 1 ? 0 : results.length - 1;
      setHighlight((current) => current < 0 ? start : (current + step + results.length) % results.length);
    }
  };

  return (
    <div
      ref={root}
      className={`header-search${expanded ? " header-search--expanded" : ""}`}
      onKeyDown={handleKeys}
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={`header-icon header-shortcut header-search-toggle${isSearchPage || expanded ? " active" : ""}`}
        aria-label={t("header.nav.search")}
        aria-expanded={expanded}
        aria-controls={expanded ? panelId : undefined}
        title={t("header.nav.search")}
        onClick={() => {
          if (expanded) return close();
          onOpen();
          setHighlight(-1);
          setExpanded(true);
        }}
      >
        <HiOutlineMagnifyingGlass aria-hidden="true" />
      </button>

      {expanded && (
        <form
          id={panelId}
          className="header-search-panel"
          role="search"
          aria-label={t("header.nav.search")}
          onSubmit={(event) => {
            event.preventDefault();
            if (!typed) return;
            changed.current = false;
            close();
            if (active) navigate(getSearchResultPath(active));
            else if (fullResults !== currentPath) navigate(fullResults, { replace: isSearchPage });
          }}
        >
          <div className="header-search-field">
            <HiOutlineMagnifyingGlass className="header-search-glyph" aria-hidden="true" />
            <input
              ref={field}
              type="text"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-controls={showDropdown ? listId : undefined}
              aria-activedescendant={active ? `${listId}-${highlight}` : undefined}
              aria-label={t("search.placeholder")}
              placeholder={t("search.headerPlaceholder")}
              value={value}
              onChange={(event) => setSearch(event.target.value)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={(event) => {
                setComposing(false);
                setSearch(event.currentTarget.value);
              }}
            />
            <button
              type="button"
              className="header-icon header-search-clear"
              aria-label={t(value ? "search.clear" : "search.closeSearch")}
              onClick={() => {
                if (!value) return close(true);
                setSearch("");
                field.current?.focus();
              }}
            >
              <HiXMark aria-hidden="true" />
            </button>
          </div>

          {showDropdown && (
            <div className="header-search-dropdown">
              {pending || isError || !results.length ? (
                <p className="header-search-status muted" role="status">
                  {t(pending ? "catalog.loading" : isError ? "search.loadError" : "search.noResults", { query: typed })}
                </p>
              ) : (
                <p className="header-search-label muted">
                  {t(results[0].media_type === "person" ? "search.people" : "search.titles")}
                </p>
              )}
              <ul id={listId} ref={list} className="header-search-options" role="listbox" aria-label={t("search.suggestions")}>
                {results.map((result, index) => (
                  <li
                    key={getSearchResultPath(result)}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={index === highlight}
                    className="header-search-result"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      changed.current = false;
                      close();
                      navigate(getSearchResultPath(result));
                    }}
                  >
                    <SearchPreview result={result} />
                    <HiArrowRight className="header-search-result-arrow" aria-hidden="true" />
                  </li>
                ))}
              </ul>
              <Link className="header-search-all" to={fullResults} replace={isSearchPage} onClick={() => {
                changed.current = false;
                close();
              }}>
                {t("search.viewAll")} <HiArrowRight aria-hidden="true" />
              </Link>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
