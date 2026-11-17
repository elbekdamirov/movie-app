import { ConfigProvider, theme } from "antd";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { memo, Suspense, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const accent = "#C61F1F";

const readDarkMode = () => {
  try {
    return localStorage.getItem("theme") !== "light";
  } catch {
    return true;
  }
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const pagePath = pathname.split("/").slice(0, 3).join("/");
  const [isDark, setIsDark] = useState(readDarkMode);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // The current theme still applies when storage is unavailable.
    }
  }, [isDark]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pagePath]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: accent, colorPrimaryHover: accent, colorPrimaryActive: accent },
      }}
    >
      <Header isDark={isDark} onToggleTheme={() => setIsDark((dark) => !dark)} />
      <main className="site-main">
        <Suspense fallback={<div className="hero-shell hero-skeleton motion-safe:animate-pulse" aria-hidden="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </ConfigProvider>
  );
};

export default memo(MainLayout);
