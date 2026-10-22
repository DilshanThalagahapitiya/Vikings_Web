import { StepSection } from '../ui/StepSection';
import { OptionChip } from '../ui/OptionChip';
import { ColorSwatch } from '../ui/ColorSwatch';
import { useDesignerStore } from '../../store/designerStore';
import { useDesignerSelection } from '../../hooks/useDesignerSelection';

/** Style, colour, GSM and size pickers – everything that resolves to a shirt code. */
export function ShirtOptions() {
  const sel = useDesignerSelection();
  const { setStyle, setColor, setGsm, setSize } = useDesignerStore();

  return (
    <StepSection step={1} title="Choose your T-shirt" aside={sel.code && `Code ${sel.code.code}`}>
      <div className="field">
        <span className="field__label">Style</span>
        <div className="chips">
          {sel.styles.map((o) => (
            <OptionChip key={o.key} selected={o.key === sel.style} onClick={() => setStyle(o.key)}>
              {o.label}
            </OptionChip>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Colour</span>
        <div className="swatches">
          {sel.colors.map((c) => (
            <ColorSwatch
              key={c.name}
              name={c.name}
              hex={c.hex}
              hex2={c.hex2}
              selected={c.name === sel.color?.name}
              onClick={() => setColor(c.name)}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Fabric weight</span>
        <div className="chips">
          {sel.gsms.map((g) => (
            <OptionChip key={g} selected={g === sel.gsm} onClick={() => setGsm(g)}>
              {g} GSM
            </OptionChip>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Size</span>
        <div className="chips">
          {sel.sizes.map((o) => (
            <OptionChip
              key={o.size}
              selected={o.size === sel.size}
              disabled={o.inStock <= 0}
              hint={o.inStock <= 0 ? 'Sold out' : o.inStock <= 2 ? `${o.inStock} left` : undefined}
              onClick={() => setSize(o.size)}
            >
              {o.size}
            </OptionChip>
          ))}
        </div>
      </div>
    </StepSection>
  );
}
