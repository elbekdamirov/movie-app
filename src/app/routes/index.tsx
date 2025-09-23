import { lazy, memo } from "react";
import { useRoutes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
const Home = lazy(() => import("@/pages/home"));
const Movie = lazy(() => import("@/pages/movie"));
const Sessions = lazy(() => import("@/pages/sessions"));
const Tickets = lazy(() => import("@/pages/tickets"));
const Search = lazy(() => import("@/pages/search"));

const MovieDetail = lazy(() => import("@/pages/movie-detail"));

const AppRouter = () => {
  const router = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "/sessions", element: <Sessions /> },
        { path: "/tickets", element: <Tickets /> },
        { path: "/search", element: <Search /> },
        { path: "/movie", element: <Movie /> },
        { path: "/movie/:id", element: <MovieDetail /> },
      ],
    },
  ]);
  return router;
};

export default memo(AppRouter);
