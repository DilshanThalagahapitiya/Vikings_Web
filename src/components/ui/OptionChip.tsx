import type { ReactNode } from 'react';

interface Props {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  hint?: string;
}

/** Pill-shaped single choice (size, GSM, style…). */
export function OptionChip({ selected, disabled, onClick, children, hint }: Props) {
  return (
    <button
      type="button"
      className={`chip${selected ? ' chip--selected' : ''}`}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
      {hint && <small className="chip__hint">{hint}</small>}
    </button>
  );
}
