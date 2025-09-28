import { memo, useState, useEffect } from "react";
import logo from "@/shared/assets/logo.svg";
import { BsDisplayFill } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { BiSolidMoviePlay } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaRegBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { Dropdown, Select, type MenuProps } from "antd";
import { logout } from "@/features/auth";
import { useTranslation } from "react-i18next";
import i18n from "@/app/i18n";

export const Header = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  const handleLogout = () => {
    dispatch(logout());
  };

  const items: MenuProps["items"] = [
    { key: "1", label: <a href="/profile">Profile</a> },
    {
      key: "2",
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`h-20 flex items-center ${
        isDark ? "bg-black" : "bg-white shadow-md"
      }`}
    >
      <div className="container flex justify-between items-center">
        <div className="flex-shrink-0">
          <NavLink to={"/"}>
            <img src={logo} alt="logo" className="h-8 md:h-10" />
          </NavLink>
        </div>

        <div
          className={`hidden lg:flex gap-6 xl:gap-[37px] ${
            isDark ? "text-[#A1A1A1]" : "text-gray-600"
          }`}
        >
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <BsDisplayFill size={25} />
            <span className="text-sm">{t("header.nav.main")}</span>
          </NavLink>

          <NavLink
            to={"/movie"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <BiSolidMoviePlay size={25} />
            <span className="text-sm">{t("header.nav.movies")}</span>
          </NavLink>

          <NavLink
            to={"/bookmark"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <FaRegBookmark size={25} />
            <span className="text-sm">{t("header.nav.saved")}</span>
          </NavLink>

          <NavLink
            to={"/search"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <IoSearch size={25} />
            <span className="text-sm">{t("header.nav.search")}</span>
          </NavLink>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "text-yellow-400 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </button>

          <Select
            className="language-select"
            value={i18n.language}
            style={{ width: 100 }}
            onChange={(lng) => i18n.changeLanguage(lng)}
            options={[
              { value: "uz", label: "UZ" },
              { value: "ru", label: "RU" },
              { value: "en", label: "EN" },
            ]}
          />

          {user ? (
            <Dropdown menu={{ items }} placement="bottomLeft">
              <img
                className="size-10 rounded-full cursor-pointer"
                src={user.picture}
                alt="user"
              />
            </Dropdown>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="py-2 px-4 md:py-4 md:px-16 bg-py text-white rounded-[12px] hover:bg-py/80 transition-colors cursor-pointer text-sm md:text-base"
            >
              {t("header.nav.login")}
            </button>
          )}

          <button
            onClick={toggleMobileMenu}
            className={`p-2 lg:hidden ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`absolute top-20 left-0 right-0 z-50 lg:hidden ${
            isDark
              ? "bg-black border-gray-700 text-white"
              : "bg-white border-gray-200"
          } border-t shadow-lg`}
        >
          <div className="py-4 space-y-4">
            <NavLink
              to={"/"}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-2"
            >
              <BsDisplayFill size={20} />
              <span>{t("header.nav.main")}</span>
            </NavLink>

            <NavLink
              to={"/movie"}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-2"
            >
              <BiSolidMoviePlay size={20} />
              <span>{t("header.nav.movies")}</span>
            </NavLink>

            <NavLink
              to={"/bookmark"}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-2"
            >
              <FaRegBookmark size={20} />
              <span>{t("header.nav.saved")}</span>
            </NavLink>

            <NavLink
              to={"/search"}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-2"
            >
              <IoSearch size={20} />
              <span>{t("header.nav.search")}</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
});
