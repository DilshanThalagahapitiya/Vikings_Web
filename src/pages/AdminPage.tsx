import { CsvManager } from '../components/admin/CsvManager';
import { PricingSettingsCard } from '../components/admin/PricingSettingsCard';
import { Button } from '../components/ui/Button';
import { Notice } from '../components/ui/Notice';
import { codesToCsv, colorsToCsv, designsToCsv, stockToCsv } from '../services/catalogParsers';
import { useCatalogStore } from '../store/catalogStore';

const PREVIEW_ROWS = 6;

export function AdminPage() {
  const { catalog, source, importCsv, saveSettings, resetToPublished } = useCatalogStore();
  if (!catalog) return null;

  return (
    <div className="admin">
      <h1>Catalog admin</h1>
      <Notice tone={source === 'local' ? 'warn' : 'info'}>
        {source === 'local' ? (
          <>
            Showing data imported in <b>this browser only</b>. To publish it for everyone, export each CSV and replace
            the files in <code>public/data/</code>, then commit and push.{' '}
            <Button variant="secondary" size="sm" onClick={() => void resetToPublished()}>
              Reset to published data
            </Button>
          </>
        ) : (
          <>
            Showing the published data from <code>public/data/*.csv</code>. Imports here are a private preview – to
            update the live site, replace those files (and settings.json) and push.
          </>
        )}
      </Notice>

      <PricingSettingsCard key={JSON.stringify(catalog.settings)} settings={catalog.settings} onSave={saveSettings} />

      <CsvManager
        title="Designs"
        description="Designs, print COST per size (blank = size not offered) and images (image_data = base64 data URL). Same file as the POS export."
        columns="id, name, small_price, medium_price, large_price, image_file, image_data"
        filename="VIKINGS_designs"
        count={catalog.designs.length}
        previewHead={['ID', 'Name', 'Small cost', 'Medium cost', 'Large cost', 'Image']}
        preview={catalog.designs
          .slice(0, PREVIEW_ROWS)
          .map((d) => [d.id, d.name, d.costs.small, d.costs.medium, d.costs.large, d.imageData ? 'embedded' : d.imageFile].map((v) => String(v ?? '–')))}
        onImport={(t) => importCsv('designs', t)}
        onExport={() => designsToCsv(catalog.designs)}
      />
      <CsvManager
        title="T-shirt codes"
        description="Every sellable shirt: type, collar, colour, GSM. Shirt cost comes from the stock file."
        columns="code, type, collar, color, gsm, in_stock"
        filename="VIKINGS_codes"
        count={catalog.codes.length}
        previewHead={['Code', 'Type', 'Collar', 'Colour', 'GSM', 'Stock']}
        preview={catalog.codes
          .slice(0, PREVIEW_ROWS)
          .map((c) => [c.code, c.type, c.collar ? 'Collar' : 'No collar', c.color, c.gsm, c.inStock].map(String))}
        onImport={(t) => importCsv('codes', t)}
        onExport={async () => codesToCsv(catalog.codes)}
      />
      <CsvManager
        title="Colours"
        description="Colour names and hex values. hex2 is an optional trim colour; status hidden removes a colour."
        columns="name, hex, hex2, status"
        filename="VIKINGS_colors"
        count={catalog.colors.length}
        previewHead={['Name', 'Hex', 'Hex 2', 'Status']}
        preview={catalog.colors
          .slice(0, PREVIEW_ROWS)
          .map((c) => [c.name, c.hex, c.hex2 ?? '–', c.visible ? 'visible' : 'hidden'])}
        onImport={(t) => importCsv('colors', t)}
        onExport={async () => colorsToCsv(catalog.colors)}
      />
      <CsvManager
        title="Stock"
        description="Stock per shirt code and size. avg_cost is the blank shirt cost used for pricing. Sizes with 0 are sold out."
        columns="code, size, in_stock, avg_cost"
        filename="VIKINGS_stock"
        count={catalog.stock.length}
        previewHead={['Code', 'Size', 'In stock', 'Avg cost']}
        preview={catalog.stock
          .slice(0, PREVIEW_ROWS)
          .map((s) => [s.code, s.size, s.inStock, s.avgCost].map(String))}
        onImport={(t) => importCsv('stock', t)}
        onExport={async () => stockToCsv(catalog.stock)}
      />
    </div>
  );
}
