import { lazy, memo } from "react";
import { Navigate, useRoutes, type RouteObject } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

const Home = lazy(() => import("@/pages/home"));
const Movie = lazy(() => import("@/pages/movie"));
const MyList = lazy(() => import("@/pages/bookmark"));
const Search = lazy(() => import("@/pages/search"));
const MovieDetail = lazy(() => import("@/pages/movie-detail"));
const Cast = lazy(() => import("@/pages/movie-detail/cast"));
const Review = lazy(() => import("@/pages/movie-detail/review"));
const Others = lazy(() => import("@/pages/movie-detail/others"));
const CrewDetail = lazy(() => import("@/pages/crew-detail"));
const Login = lazy(() => import("@/pages/login"));
const About = lazy(() => import("@/pages/about"));
const Awards = lazy(() => import("@/pages/awards"));
const NotFound = lazy(() => import("@/pages/notfound"));

const detailTabs: RouteObject[] = [
  { index: true, element: <Review /> },
  { path: "cast", element: <Cast /> },
  { path: "others", element: <Others /> },
];

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "my-list", element: <MyList /> },
      { path: "bookmark", element: <Navigate to="/my-list" replace /> },
      { path: "search", element: <Search /> },
      { path: "movie", element: <Movie /> },
      { path: "movie/:id", element: <MovieDetail />, children: detailTabs },
      { path: "tv", element: <Movie type="tv" /> },
      { path: "tv/:id", element: <MovieDetail type="tv" />, children: detailTabs },
      { path: "login", element: <Login /> },
      { path: "about", element: <About /> },
      { path: "awards", element: <Awards /> },
      { path: "crew/:id", element: <CrewDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

const AppRouter = () => useRoutes(routes);

export default memo(AppRouter);
