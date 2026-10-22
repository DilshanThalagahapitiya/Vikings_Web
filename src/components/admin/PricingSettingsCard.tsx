import { useState } from 'react';
import { downloadText } from '../../lib/download';
import type { PricingSettings } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  settings: PricingSettings;
  onSave: (settings: PricingSettings) => Promise<void>;
}

/** Margin / packing / power / rounding – the same values as the POS Settings → Pricing & costs. */
export function PricingSettingsCard({ settings, onSave }: Props) {
  const [form, setForm] = useState({
    margin: String(Math.round(settings.margin * 1000) / 10),
    packing: String(settings.packing),
    power: String(settings.power),
    roundTo: String(settings.roundTo),
  });
  const parsed: PricingSettings = {
    margin: (Number(form.margin) || 0) / 100,
    packing: Number(form.packing) || 0,
    power: Number(form.power) || 0,
    roundTo: Number(form.roundTo) || 0,
  };
  const field = (key: keyof typeof form, label: string) => (
    <label>
      {label}
      <input type="number" min="0" step="any" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </label>
  );

  return (
    <section className="card">
      <h2>Pricing rules</h2>
      <p className="muted">
        Price = (blank shirt cost + print costs + packing + power) × (1 + margin), rounded up. Customers only see the
        final price.
      </p>
      <div className="form-row form-row--4">
        {field('margin', 'Profit margin %')}
        {field('packing', 'Packing per shirt')}
        {field('power', 'Power per shirt')}
        {field('roundTo', 'Round up to')}
      </div>
      <div className="actions">
        <Button size="sm" onClick={() => void onSave(parsed)}>
          Apply (this browser)
        </Button>
        <Button variant="secondary" size="sm" onClick={() => downloadText('settings.json', JSON.stringify(parsed, null, 2) + '\n', 'application/json')}>
          Export settings.json
        </Button>
      </div>
      <p className="muted small">To publish: replace <code>public/data/settings.json</code> and push.</p>
    </section>
  );
}
