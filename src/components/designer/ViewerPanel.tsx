import { useMemo, useState } from 'react';
import { ShirtCanvas } from '../viewer/ShirtCanvas';
import type { ViewRequest } from '../viewer/CameraRig';
import { Button } from '../ui/Button';
import { useDesignerSelection } from '../../hooks/useDesignerSelection';
import { designImageUrl } from '../../services/designImage';
import { todayStamp } from '../../lib/download';
import type { PlacementId } from '../../types';
import type { ShirtPrint } from '../viewer/ShirtModel';

interface Props {
  view: ViewRequest;
  onView: (angle: number) => void;
}

const VIEWS = [
  { label: 'Front', angle: 0 },
  { label: 'Left', angle: Math.PI / 2 },
  { label: 'Back', angle: Math.PI },
  { label: 'Right', angle: -Math.PI / 2 },
];

export function ViewerPanel({ view, onView }: Props) {
  const { catalog, style, size, color, prints } = useDesignerSelection();
  const [spin, setSpin] = useState(false);

  const printList = useMemo(
    () =>
      (Object.entries(prints) as [PlacementId, string][]).flatMap(([placement, id]): ShirtPrint[] => {
        const design = catalog.designs.find((d) => d.id === id);
        return design ? [{ placement, imageUrl: designImageUrl(design) }] : [];
      }),
    [catalog.designs, prints],
  );

  if (!style || !size || !color) return null;

  const savePreview = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('.viewer__stage canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `vikings-preview-${todayStamp()}.png`;
    a.click();
  };

  return (
    <div className="viewer">
      <div className="viewer__stage">
        <ShirtCanvas
          view={view}
          autoRotate={spin}
          style={style}
          size={size}
          color={color.hex}
          trimColor={color.hex2}
          prints={printList}
        />
      </div>
      <div className="viewer__bar">
        {VIEWS.map((v) => (
          <Button key={v.label} variant="secondary" size="sm" onClick={() => onView(v.angle)}>
            {v.label}
          </Button>
        ))}
        <Button variant={spin ? 'primary' : 'ghost'} size="sm" onClick={() => setSpin(!spin)}>
          {spin ? 'Stop spin' : 'Spin'}
        </Button>
        <Button variant="ghost" size="sm" onClick={savePreview}>
          Save image
        </Button>
      </div>
    </div>
  );
}
