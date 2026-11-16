import { Pagination } from "antd";
import { MAX_TMDB_PAGE } from "@/entities/movie";
import { memo, type FC } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  page: number;
  total_pages: number;
}

export const MoviePagination: FC<Props> = memo(({ page, total_pages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pages = Math.min(total_pages, MAX_TMDB_PAGE);

  if (pages < 2) return null;

  return (
    <div className="catalog-pagination flex justify-center pt-8">
      <Pagination
        current={Math.min(page, pages)}
        onChange={(nextPage) => {
          const next = new URLSearchParams(searchParams);
          next.set("page", String(nextPage));
          setSearchParams(next);
          window.scrollTo(0, 0);
        }}
        total={pages}
        pageSize={1}
        showLessItems
        showSizeChanger={false}
      />
    </div>
  );
});
