# VIKINGS – Custom T-Shirt Studio

Static React + Three.js web app: customers pick a T-shirt (regular / oversize / regular collar), colour, GSM and size, place designs on **front left, front middle, back middle, back full**, preview everything on a rotating 3D shirt, then add it to a cart and send the order (WhatsApp text / CSV).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` and publishes the site.

The app uses relative asset paths and a hash router, so it works under `https://<user>.github.io/<repo>/` with no extra config.

## Updating the catalog (designs, codes, colours, stock)

The live data is the four CSV files in `public/data/` plus the design images in `public/designs/`.

| File | Columns |
| --- | --- |
| `designs.csv` | `id, name, small_price, medium_price, large_price, image_file, image_data` |
| `codes.csv` | `code, type, collar, color, gsm, in_stock` + optional `price` (blank shirt price) |
| `colors.csv` | `name, hex, hex2, status` (`hex2` = optional trim colour, `status` = visible/hidden) |
| `stock.csv` | `code, size, in_stock, avg_cost` (…extra columns ignored) |

- A design is offered at a position only if it has a price for that position's size: front left → `small_price`, front middle & back middle → `medium_price`, back full → `large_price`.
- `image_data` may hold a base64 `data:` URL; if empty, `public/designs/<image_file>` is used.
- Type `Oversize` → oversize model; `collar` = `Collar` → collar model; anything else → regular.

**Workflow:** open `#/admin` (link in the footer), import a CSV to preview it, export the files, replace them in `public/data/` (and add new images to `public/designs/`), commit and push. Admin imports are stored in the browser only – they never change what customers see until the files are pushed.

## Settings

`src/config/app.ts` – currency, default blank-shirt price, WhatsApp number for orders, size scaling of the 3D model.
`src/config/placements.ts` – print positions: box size and location on the shirt.

## Structure

```
src/
  components/
    ui/        Button, OptionChip, ColorSwatch, QuantityInput, StepSection, Notice, FilePicker
    layout/    Header, Footer, AppLayout, CatalogGate
    viewer/    ShirtCanvas (stage), ShirtModel, PrintDecal, CameraRig
    designer/  ShirtOptions, PrintPlacement, DesignGrid, OrderPanel, ViewerPanel
    cart/      CartLine
    admin/     CsvManager
  pages/       StudioPage, CartPage, AdminPage
  store/       catalogStore, designerStore, cartStore   (zustand)
  services/    catalogParsers (CSV <-> models), catalogApi, catalogSelectors, orderService
  lib/         csv, download, format, shirtGeometry (procedural 3D shirt)
  config/      app, placements
  types/
public/        data/*.csv, designs/*.png
```
