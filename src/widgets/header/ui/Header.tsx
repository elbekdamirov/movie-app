import { memo } from "react";
import logo from "@/shared/assets/logo.svg";
import { Link, NavLink } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
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

export const Header = memo(({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) => {
  const { t, i18n } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const accountItems: MenuProps["items"] = [
    { key: "account", label: user?.name || user?.email, disabled: true },
    { key: "logout", label: t("header.nav.logout"), onClick: () => dispatch(logout()) },
  ];

  const themeLabel = t(isDark ? "header.nav.light" : "header.nav.dark");
  const renderNav = (className: string) => catalogLinks.map(({ to, label, icon: Icon }) => (
    <NavLink key={to} to={to} end={to === "/"} className={className}>
      <Icon aria-hidden="true" />
      <span>{t(`header.nav.${label}`)}</span>
    </NavLink>
  ));

  return (
    <>
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" aria-label={t("header.nav.main")} className="shrink-0">
          <img src={logo} alt="" className="header-logo w-[88px] sm:w-[108px]" />
        </Link>

        <nav className="main-navigation hidden lg:flex" aria-label={t("header.nav.navigation")}>
          {renderNav("header-link")}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
          <HeaderSearch />
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
            <Link to="/login" className="action action-primary header-login">{t("header.nav.login")}</Link>
          )}
        </div>
      </div>
    </header>
    <nav className="mobile-bottom-navigation lg:hidden" aria-label={t("header.nav.navigation")}>
      {renderNav("mobile-bottom-link")}
    </nav>
    </>
  );
});
