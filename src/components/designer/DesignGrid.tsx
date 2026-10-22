import { PRINT_SIZE_LABEL } from '../../config/placements';
import { designImageUrl } from '../../services/designImage';
import { printPrice } from '../../services/pricing';
import { useCatalogStore } from '../../store/catalogStore';
import type { Design, PrintSize } from '../../types';

interface Props {
  designs: Design[];
  /** Sizes allowed at the current position. */
  sizes: PrintSize[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function DesignGrid({ designs, sizes, selectedId, onSelect }: Props) {
  const catalog = useCatalogStore((s) => s.catalog)!;
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
          <span className="design-card__price">
            {sizes
              .filter((s) => d.costs[s] !== null)
              .map((s) => `${PRINT_SIZE_LABEL[s][0]} ${printPrice(catalog, d, s)}`)
              .join(' · ')}
          </span>
        </button>
      ))}
    </div>
  );
}
