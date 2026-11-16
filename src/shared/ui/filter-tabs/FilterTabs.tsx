interface FilterTabsProps<Value extends string> {
  label: string;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
}

export const FilterTabs = <Value extends string>({ label, value, options, onChange }: FilterTabsProps<Value>) => (
  <div className="browse-tabs" role="group" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
