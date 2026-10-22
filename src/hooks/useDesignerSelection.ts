import { useMemo } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import { useDesignerStore } from '../store/designerStore';
import {
  colorByName,
  colorsForStyle,
  findCode,
  gsmOptions,
  sizesForCode,
  styleOptions,
} from '../services/catalogSelectors';

/** Resolves the raw designer choices against the catalog, falling back to the first valid option. */
export function useDesignerSelection() {
  const catalog = useCatalogStore((s) => s.catalog)!;
  const { style: s, color: c, gsm: g, size: sz, prints } = useDesignerStore();

  return useMemo(() => {
    const styles = styleOptions(catalog.codes);
    const style = styles.find((o) => o.key === s)?.key ?? styles[0]?.key;
    const colors = style ? colorsForStyle(catalog, style) : [];
    const color = colors.find((o) => o.name === c) ?? colors[0];
    const gsms = style && color ? gsmOptions(catalog.codes, style, color.name) : [];
    const gsm = gsms.includes(g ?? -1) ? g! : gsms[0];
    const code = style && color && gsm !== undefined ? findCode(catalog.codes, style, color.name, gsm) : undefined;
    const sizes = code ? sizesForCode(catalog, code) : [];
    const size =
      sizes.find((o) => o.size === sz)?.size ?? sizes.find((o) => o.inStock > 0)?.size ?? sizes[0]?.size;
    const colorDef = color && colorByName(catalog, color.name);
    return { catalog, styles, style, colors, color: colorDef, gsms, gsm, code, sizes, size, prints };
  }, [catalog, s, c, g, sz, prints]);
}
