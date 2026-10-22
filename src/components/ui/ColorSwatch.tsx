interface Props {
  name: string;
  hex: string;
  hex2?: string;
  selected: boolean;
  onClick: () => void;
}

export function ColorSwatch({ name, hex, hex2, selected, onClick }: Props) {
  const background = hex2 ? `linear-gradient(135deg, ${hex} 50%, ${hex2} 50%)` : hex;
  return (
    <button
      type="button"
      className={`swatch${selected ? ' swatch--selected' : ''}`}
      title={name}
      aria-label={name}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="swatch__dot" style={{ background }} />
      <span className="swatch__name">{name}</span>
    </button>
  );
}
