import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../lib/format';
import { quote } from '../../services/pricing';
import { useCartStore } from '../../store/cartStore';
import { useDesignerSelection } from '../../hooks/useDesignerSelection';
import { Button } from '../ui/Button';
import { QuantityInput } from '../ui/QuantityInput';
import { StepSection } from '../ui/StepSection';

export function OrderPanel() {
  const { catalog, code, size, sizes, prints } = useDesignerSelection();
  const addToCart = useCartStore((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!code || !size) return null;
  const custom = { code: code.code, size, prints };
  const { lines, total } = quote(catalog, custom);
  const stock = sizes.find((s) => s.size === size)?.inStock ?? 0;
  const qty = Math.min(quantity, Math.max(1, stock));

  return (
    <StepSection step={3} title="Review & add to cart">
      <ul className="price-lines">
        {lines.map((l) => (
          <li key={l.label}>
            <span>{l.label}</span>
            <span>{formatMoney(l.amount)}</span>
          </li>
        ))}
        <li className="price-lines__total">
          <span>Per shirt</span>
          <span>{formatMoney(total)}</span>
        </li>
      </ul>

      <div className="order-actions">
        <QuantityInput value={qty} onChange={setQuantity} max={Math.max(1, stock)} />
        <Button
          disabled={stock <= 0}
          onClick={() => {
            addToCart(custom, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500);
          }}
        >
          {stock <= 0 ? 'Out of stock' : `Add to cart · ${formatMoney(total * qty)}`}
        </Button>
      </div>
      {added && (
        <p className="muted">
          Added! <Link to="/cart">View cart</Link>
        </p>
      )}
    </StepSection>
  );
}
