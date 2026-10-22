import { APP_NAME, WHATSAPP_NUMBER } from '../config/app';
import { PLACEMENT_BY_ID } from '../config/placements';
import { toCsv } from '../lib/csv';
import { formatMoney } from '../lib/format';
import type { CartItem, Catalog, PlacementId } from '../types';
import { unitPrice } from './catalogSelectors';

function describePrints(catalog: Catalog, item: CartItem): string {
  const parts = (Object.entries(item.prints) as [PlacementId, string][]).map(([p, id]) => {
    const name = catalog.designs.find((d) => d.id === id)?.name ?? id;
    return `${PLACEMENT_BY_ID[p].label}: ${name}`;
  });
  return parts.join(', ') || 'No print';
}

export const cartTotal = (catalog: Catalog, items: CartItem[]) =>
  items.reduce((sum, i) => sum + unitPrice(catalog, i) * i.quantity, 0);

export function orderText(catalog: Catalog, items: CartItem[], customer: { name: string; phone: string }): string {
  const lines = items.map((item, i) => {
    const code = catalog.codes.find((c) => c.code === item.code);
    return `${i + 1}. ${item.code} (${code?.color ?? ''}, ${code?.gsm ?? ''} GSM) size ${item.size} x${item.quantity}\n   ${describePrints(catalog, item)}\n   ${formatMoney(unitPrice(catalog, item) * item.quantity)}`;
  });
  return [
    `${APP_NAME} order`,
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    '',
    ...lines,
    '',
    `Total: ${formatMoney(cartTotal(catalog, items))}`,
  ].join('\n');
}

export const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export function orderCsv(catalog: Catalog, items: CartItem[]): string {
  return toCsv(
    ['code', 'size', 'quantity', 'prints', 'unit_price', 'line_total'],
    items.map((i) => [
      i.code,
      i.size,
      i.quantity,
      describePrints(catalog, i),
      unitPrice(catalog, i),
      unitPrice(catalog, i) * i.quantity,
    ]),
  );
}
