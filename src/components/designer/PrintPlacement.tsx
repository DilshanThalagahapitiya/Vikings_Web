import { PLACEMENTS, PLACEMENT_BY_ID, PRINT_SIZE_LABEL } from '../../config/placements';
import { designsForPlacement } from '../../services/catalogSelectors';
import { useDesignerStore } from '../../store/designerStore';
import { useDesignerSelection } from '../../hooks/useDesignerSelection';
import { designImageUrl } from '../../services/designImage';
import { Button } from '../ui/Button';
import { StepSection } from '../ui/StepSection';
import { DesignGrid } from './DesignGrid';
import type { PlacementId } from '../../types';

interface Props {
  /** Called when the viewer should turn to show a side of the shirt. */
  onShowSide: (side: 'front' | 'back') => void;
}

/** Pick a print position, then a design for it. */
export function PrintPlacement({ onShowSide }: Props) {
  const { catalog, prints } = useDesignerSelection();
  const { activePlacement, setActivePlacement, setPrint } = useDesignerStore();
  const placement = PLACEMENT_BY_ID[activePlacement];
  const designs = designsForPlacement(catalog.designs, activePlacement);

  const activate = (id: PlacementId) => {
    setActivePlacement(id);
    onShowSide(PLACEMENT_BY_ID[id].side);
  };

  return (
    <StepSection step={2} title="Add prints" aside="Pick a position, then a design">
      <div className="placements">
        {PLACEMENTS.map((p) => {
          const design = catalog.designs.find((d) => d.id === prints[p.id]);
          return (
            <button
              key={p.id}
              type="button"
              className={`placement${p.id === activePlacement ? ' placement--active' : ''}`}
              onClick={() => activate(p.id)}
            >
              <span className="placement__thumb">
                {design ? <img src={designImageUrl(design)} alt="" /> : <span>+</span>}
              </span>
              <span className="placement__label">{p.label}</span>
              <span className="placement__sub">{design ? design.name : PRINT_SIZE_LABEL[p.printSize]}</span>
            </button>
          );
        })}
      </div>

      <div className="placement-head">
        <strong>{placement.label}</strong>
        {prints[activePlacement] && (
          <Button variant="ghost" size="sm" onClick={() => setPrint(activePlacement, null)}>
            Remove print
          </Button>
        )}
      </div>
      <DesignGrid
        designs={designs}
        printSize={placement.printSize}
        selectedId={prints[activePlacement]}
        onSelect={(id) => {
          setPrint(activePlacement, id);
          onShowSide(placement.side);
        }}
      />
    </StepSection>
  );
}
