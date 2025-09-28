import type { IMovie } from "@/entities/movie";
import { memo, useState, type FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { createImageUrl } from "@/shared/utils";
import { FaPlay } from "react-icons/fa";

interface Props {
  movies: IMovie[];
  loading: boolean;
}

export const Hero: FC<Props> = memo(({ movies, loading }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="mb-1">
          <div className="w-full h-[640px] rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse" />
        </div>

        <div className="max-w-2xl mx-auto flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[108px] h-[64px] rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-1">
        <Swiper
          style={
            {
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
              borderRadius: "12px",
              maxHeight: "640px",
              width: "100%",
              height: "640px",
            } as React.CSSProperties
          }
          loop
          spaceBetween={10}
          navigation
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
        >
          {movies?.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div
                className="w-full h-full rounded-xl bg-cover bg-center bg-no-repeat flex items-end justify-center p-6"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${createImageUrl(
                    movie?.backdrop_path
                  )})`,
                }}
                title={movie.title}
              >
                <div className="text-center max-w-4xl px-6">
                  <h2 className="text-white text-4xl font-bold drop-shadow-lg mb-4">
                    {movie.title}
                  </h2>

                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-white/90 text-xl font-medium">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                    <span className="text-white/70 text-2xl">•</span>
                    <span className="text-white/90 text-xl uppercase tracking-wide">
                      {movie.original_language}
                    </span>
                  </div>

                  <button className="bg-white py-4 px-8 text-py font-semibold flex items-center gap-3 rounded-xl cursor-pointer mx-auto hover:bg-gray-100 transition-colors">
                    <FaPlay className="text-lg" />
                    Смотреть
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="max-w-2xl mx-auto">
        <Swiper
          onSwiper={setThumbsSwiper}
          loop
          spaceBetween={10}
          slidesPerView={6}
          freeMode
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          breakpoints={{
            320: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 5,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
          className="thumbs-swiper"
        >
          {movies?.map((movie) => (
            <SwiperSlide key={movie.id} className="cursor-pointer">
              <div
                className="w-[108px] h-[64px] overflow-hidden rounded-lg mx-auto"
                title={movie.title}
              >
                <img
                  src={createImageUrl(movie.backdrop_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
});
