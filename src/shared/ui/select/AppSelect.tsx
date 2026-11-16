import { Select, type SelectProps } from "antd";
import { HiChevronDown, HiXMark } from "react-icons/hi2";

export const AppSelect = <Value extends string | number>({ className, ...props }: SelectProps<Value>) => (
  <Select<Value>
    popupMatchSelectWidth={false}
    {...props}
    className={`app-select ${className ?? ""}`}
    classNames={{ popup: { root: "app-select-options" } }}
    suffixIcon={<HiChevronDown aria-hidden="true" />}
    allowClear={props.allowClear ? { clearIcon: <HiXMark aria-hidden="true" /> } : false}
    virtual={false}
  />
);
