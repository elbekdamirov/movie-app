import { memo } from "react";
import { Link } from "react-router-dom";
import logo from "@/shared/assets/logo.svg";
import { useTranslation } from "react-i18next";

export const Footer = memo(() => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <Link to="/" aria-label={t("header.nav.main")}><img src={logo} alt="" className="w-24" /></Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm" aria-label={t("header.nav.navigation")}>
          <Link to="/movie">{t("header.nav.movies")}</Link>
          <Link to="/tv">{t("header.nav.series")}</Link>
          <Link to="/awards">{t("header.nav.awards")}</Link>
          <Link to="/my-list">{t("header.nav.myList")}</Link>
          <Link to="/about">{t("about.title")}</Link>
        </nav>
      </div>
    </footer>
  );
});
