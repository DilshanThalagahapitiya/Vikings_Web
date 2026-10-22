interface Props {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function QuantityInput({ value, onChange, max = 99 }: Props) {
  return (
    <div className="qty">
      <button type="button" aria-label="Decrease" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        −
      </button>
      <span>{value}</span>
      <button type="button" aria-label="Increase" disabled={value >= max} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
