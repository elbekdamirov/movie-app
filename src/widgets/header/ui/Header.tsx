import { memo, useState, useEffect } from "react";
import logo from "@/shared/assets/logo.svg";
import { BsDisplayFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { CgDisplaySpacing } from "react-icons/cg";
import { TbTicket } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { BiSolidMoviePlay } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export const Header = memo(() => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

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

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`h-20 flex items-center ${
        isDark ? "bg-black" : "bg-white shadow-md"
      }`}
    >
      <div className="container flex justify-between items-center">
        <div className="flex-shrink-0">
          <NavLink to={"/"}>
            <img src={logo} alt="" className="h-8 md:h-10" />
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
            <span className="text-sm">Afisha</span>
          </NavLink>

          <NavLink
            to={"/movie"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <BiSolidMoviePlay size={25} />
            <span className="text-sm">Movies</span>
          </NavLink>

          <NavLink
            to={"/sessions"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <CgDisplaySpacing size={25} />
            <span className="text-sm">Сеансы</span>
          </NavLink>

          <NavLink
            to={"/tickets"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <TbTicket size={25} />
            <span className="text-sm">Билеты</span>
          </NavLink>

          <NavLink
            to={"/search"}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive && "text-py"}`
            }
          >
            <IoSearch size={25} />
            <span className="text-sm">Поиск</span>
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2 md:gap-4">
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
          <button className="py-2 px-4 md:py-4 md:px-16 bg-py text-white rounded-[12px] hover:bg-py/80 transition-colors cursor-pointer text-sm md:text-base">
            Войти
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "text-yellow-400 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className={`p-2 ${isDark ? "text-white" : "text-gray-800"}`}
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`absolute top-20 left-0 right-0 z-50 lg:hidden ${
            isDark ? "bg-black border-gray-700" : "bg-white border-gray-200"
          } border-t shadow-lg`}
        >
          <div className="container py-4 space-y-4">
            <div
              className={`flex flex-col space-y-4 ${
                isDark ? "text-[#A1A1A1]" : "text-gray-600"
              }`}
            >
              <NavLink
                to={"/"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded ${isActive && "text-py"}`
                }
              >
                <BsDisplayFill size={20} />
                <span>Afisha</span>
              </NavLink>

              <NavLink
                to={"/movie"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded ${isActive && "text-py"}`
                }
              >
                <BiSolidMoviePlay size={20} />
                <span>Movies</span>
              </NavLink>

              <NavLink
                to={"/sessions"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded ${isActive && "text-py"}`
                }
              >
                <CgDisplaySpacing size={20} />
                <span>Сеансы</span>
              </NavLink>

              <NavLink
                to={"/tickets"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded ${isActive && "text-py"}`
                }
              >
                <TbTicket size={20} />
                <span>Билеты</span>
              </NavLink>

              <NavLink
                to={"/search"}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded ${isActive && "text-py"}`
                }
              >
                <IoSearch size={20} />
                <span>Поиск</span>
              </NavLink>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeMobileMenu}
                className="w-full py-3 bg-py text-white rounded-[12px] hover:bg-py/80 transition-colors"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
