import { Pagination, type PaginationProps } from "antd";
import { memo, type FC } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  page: string;
  total_pages: number;
}

export const MoviePagination: FC<Props> = memo((props) => {
  const { page, total_pages } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange: PaginationProps["onChange"] = (p) => {
    searchParams.set("page", p.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="py-10 flex justify-center ">
      <Pagination
        current={Number(page)}
        onChange={onChange}
        total={total_pages > 10000 ? 10000 : total_pages}
        pageSize={20}
        showSizeChanger={false}
      />
    </div>
  );
});
