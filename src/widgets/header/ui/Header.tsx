import { memo, useState } from "react";
import logo from "@/shared/assets/logo.svg";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  HiOutlineBookmark, HiOutlineFilm, HiOutlineHome,
  HiOutlineTrophy, HiOutlineTv, HiOutlineUserCircle,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { Dropdown, type MenuProps } from "antd";
import { AppSelect } from "@/shared/ui";
import { logout } from "@/features/auth";
import { HeaderSearch } from "@/features/search-movie/ui/HeaderSearch";
import { useTranslation } from "react-i18next";

const catalogLinks = [
  { to: "/", label: "main", icon: HiOutlineHome },
  { to: "/movie", label: "movies", icon: HiOutlineFilm },
  { to: "/tv", label: "series", icon: HiOutlineTv },
  { to: "/awards", label: "awards", icon: HiOutlineTrophy },
  { to: "/my-list", label: "myList", icon: HiOutlineBookmark },
];

export const Header = memo(({ isDark, overHero, onToggleTheme }: { isDark: boolean; overHero: boolean; onToggleTheme: () => void }) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const isMobileMenuOpen = openMenuPath === pathname;

  const accountItems: MenuProps["items"] = [
    { key: "account", label: user?.name || user?.email, disabled: true },
    { key: "logout", label: t("header.nav.logout"), onClick: () => dispatch(logout()) },
  ];

  const closeMenu = () => setOpenMenuPath(null);
  const themeLabel = t(isDark ? "header.nav.light" : "header.nav.dark");
  const renderNav = () => catalogLinks.map(({ to, label, icon: Icon }) => (
    <NavLink key={to} to={to} end={to === "/"} className="header-link" onClick={closeMenu}>
      <Icon aria-hidden="true" />
      {t(`header.nav.${label}`)}
    </NavLink>
  ));

  return (
    <header className={`site-header${overHero ? " site-header--hero" : ""}`}>
      <div className="container header-inner">
        <Link to="/" aria-label={t("header.nav.main")} className="shrink-0" onClick={closeMenu}>
          <img src={logo} alt="" className="header-logo w-[88px] sm:w-[108px]" />
        </Link>

        <nav className="main-navigation hidden lg:flex" aria-label={t("header.nav.navigation")}>
          {renderNav()}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
          <HeaderSearch onOpen={closeMenu} />
          <NavLink to="/my-list" className="header-icon header-shortcut hidden! sm:grid! lg:hidden!" aria-label={t("header.nav.myList")} title={t("header.nav.myList")} onClick={closeMenu}>
            <HiOutlineBookmark aria-hidden="true" />
          </NavLink>
          <button type="button" className="header-icon" aria-label={themeLabel} title={themeLabel} onClick={onToggleTheme}>
            {isDark ? <MdLightMode aria-hidden="true" /> : <MdDarkMode aria-hidden="true" />}
          </button>
          <AppSelect<string>
            className="header-language"
            aria-label={t("header.nav.language")}
            value={i18n.resolvedLanguage || "en"}
            onChange={(language) => void i18n.changeLanguage(language)}
            popupMatchSelectWidth={112}
            options={[
              { value: "en", label: "EN" },
              { value: "ru", label: "RU" },
              { value: "uz", label: "UZ" },
            ]}
          />
          {user ? (
            <Dropdown menu={{ items: accountItems }} trigger={["click"]} placement="bottomRight">
              <button type="button" className="header-icon overflow-hidden" aria-label={t("header.nav.account")}>
                {user.picture
                  ? <img className="size-full rounded-full object-cover" src={user.picture} alt="" referrerPolicy="no-referrer" />
                  : <HiOutlineUserCircle aria-hidden="true" />}
              </button>
            </Dropdown>
          ) : (
            <Link to="/login" className="action action-primary header-login" onClick={closeMenu}>{t("header.nav.login")}</Link>
          )}
          <button
            type="button"
            className="header-icon lg:hidden!"
            aria-label={t("header.nav.navigation")}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setOpenMenuPath(isMobileMenuOpen ? null : pathname)}
          >
            {isMobileMenuOpen ? <HiX aria-hidden="true" /> : <HiMenuAlt3 aria-hidden="true" />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav className="mobile-menu lg:hidden" aria-label={t("header.nav.navigation")}>
          <div className="container grid gap-1">{renderNav()}</div>
        </nav>
      )}
    </header>
  );
});
