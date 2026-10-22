import { formatMoney } from '../../lib/format';
import { designImageUrl } from '../../services/designImage';
import type { Design, PrintSize } from '../../types';

interface Props {
  designs: Design[];
  printSize: PrintSize;
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function DesignGrid({ designs, printSize, selectedId, onSelect }: Props) {
  if (!designs.length) return <p className="muted">No designs available for this position.</p>;
  return (
    <div className="design-grid">
      {designs.map((d) => (
        <button
          key={d.id}
          type="button"
          className={`design-card${d.id === selectedId ? ' design-card--selected' : ''}`}
          onClick={() => onSelect(d.id)}
          aria-pressed={d.id === selectedId}
        >
          <span className="design-card__img">
            <img src={designImageUrl(d)} alt={d.name} loading="lazy" />
          </span>
          <span className="design-card__name">{d.name}</span>
          <span className="design-card__price">{formatMoney(d.prices[printSize] ?? 0)}</span>
        </button>
      ))}
    </div>
  );
}
