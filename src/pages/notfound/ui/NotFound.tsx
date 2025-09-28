import { memo } from "react";
import { Link } from "react-router-dom";
import logo from "@/shared/assets/logo2.svg";

export const NotFound = memo(() => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="relative w-64 h-64">
        <img src={logo} alt="logo" className="w-full h-full opacity-90" />

        <span
          className="absolute inset-0 flex items-center justify-center text-7xl font-extrabold text-white tracking-[40px] animate-pulse"
          style={{
            textShadow:
              "0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(255,0,0,0.6)",
          }}
        >
          404
        </span>
      </div>

      <p className="text-lg text-gray-600 dark:text-gray-300">
        Oops! Page not found
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
});
