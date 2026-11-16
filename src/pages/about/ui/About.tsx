import { useTranslation } from "react-i18next";

export const About = () => {
  const { t } = useTranslation();

  return (
    <section className="container page-section">
      <h1 className="page-title">{t("about.title")}</h1>
      <div className="mt-6 flex max-w-xl items-center gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          <img className="w-12" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Tmdb.new.logo.svg" alt="TMDB" />
        </a>
        <div>
          <p>{t("catalog.tmdbAttribution")}</p>
          <a className="section-link mt-2" href="https://commons.wikimedia.org/wiki/File:Tmdb.new.logo.svg" target="_blank" rel="noreferrer">
            {t("catalog.logoCredits")}
          </a>
        </div>
      </div>
    </section>
  );
};
