import { PLACEMENT_BY_ID } from '../../config/placements';
import { formatMoney } from '../../lib/format';
import { designImageUrl } from '../../services/designImage';
import { unitPrice } from '../../services/catalogSelectors';
import { useCartStore } from '../../store/cartStore';
import type { CartItem, Catalog, PlacementId } from '../../types';
import { Button } from '../ui/Button';
import { QuantityInput } from '../ui/QuantityInput';

export function CartLine({ item, catalog }: { item: CartItem; catalog: Catalog }) {
  const { setQuantity, remove } = useCartStore();
  const code = catalog.codes.find((c) => c.code === item.code);
  const color = catalog.colors.find((c) => c.name.toLowerCase() === code?.color.toLowerCase());
  const prints = Object.entries(item.prints) as [PlacementId, string][];

  return (
    <li className="cart-line">
      <span className="cart-line__shirt" style={{ background: color?.hex ?? '#ddd' }} />
      <div className="cart-line__body">
        <strong>
          {item.code} · {code?.color} · {code?.gsm} GSM · {item.size}
        </strong>
        <div className="cart-line__prints">
          {prints.length === 0 && <span className="muted">No print</span>}
          {prints.map(([p, id]) => {
            const d = catalog.designs.find((x) => x.id === id);
            return (
              d && (
                <span key={p} className="cart-print">
                  <img src={designImageUrl(d)} alt="" />
                  {PLACEMENT_BY_ID[p].label}: {d.name}
                </span>
              )
            );
          })}
        </div>
      </div>
      <QuantityInput value={item.quantity} onChange={(q) => setQuantity(item.id, q)} />
      <strong className="cart-line__total">{formatMoney(unitPrice(catalog, item) * item.quantity)}</strong>
      <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
        Remove
      </Button>
    </li>
  );
}
