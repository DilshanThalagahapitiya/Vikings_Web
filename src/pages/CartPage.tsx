import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartLine } from '../components/cart/CartLine';
import { Button } from '../components/ui/Button';
import { Notice } from '../components/ui/Notice';
import { WHATSAPP_NUMBER } from '../config/app';
import { downloadText, todayStamp } from '../lib/download';
import { formatMoney } from '../lib/format';
import { cartTotal, orderCsv, orderText, whatsappUrl } from '../services/orderService';
import { useCartStore } from '../store/cartStore';
import { useCatalogStore } from '../store/catalogStore';

export function CartPage() {
  const catalog = useCatalogStore((s) => s.catalog)!;
  const { items, clear } = useCartStore();
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [copied, setCopied] = useState(false);

  if (!items.length) {
    return (
      <div className="center">
        <h1>Your cart is empty</h1>
        <Link to="/" className="btn btn--primary btn--md">
          Start designing
        </Link>
      </div>
    );
  }

  const text = orderText(catalog, items, customer);
  const ready = customer.name.trim() && customer.phone.trim();

  return (
    <div className="cart">
      <h1>Your cart</h1>
      <ul className="cart-lines">
        {items.map((i) => (
          <CartLine key={i.id} item={i} catalog={catalog} />
        ))}
      </ul>
      <div className="cart__total">
        <span>Total</span>
        <strong>{formatMoney(cartTotal(catalog, items))}</strong>
      </div>

      <section className="card">
        <h2>Place order</h2>
        <div className="form-row">
          <label>
            Name
            <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          </label>
          <label>
            Phone
            <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          </label>
        </div>
        {!ready && <Notice>Enter your name and phone number to send the order.</Notice>}
        <div className="actions">
          {WHATSAPP_NUMBER && (
            <a
              className={`btn btn--primary btn--md${ready ? '' : ' is-disabled'}`}
              href={ready ? whatsappUrl(text) : undefined}
              target="_blank"
              rel="noreferrer"
            >
              Send via WhatsApp
            </a>
          )}
          <Button
            variant={WHATSAPP_NUMBER ? 'secondary' : 'primary'}
            disabled={!ready}
            onClick={async () => {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? 'Copied!' : 'Copy order text'}
          </Button>
          <Button variant="secondary" onClick={() => downloadText(`vikings-order-${todayStamp()}.csv`, orderCsv(catalog, items))}>
            Download order CSV
          </Button>
          <Button variant="ghost" onClick={clear}>
            Clear cart
          </Button>
        </div>
      </section>
    </div>
  );
}
