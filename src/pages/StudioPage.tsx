import { useState } from 'react';
import { OrderPanel } from '../components/designer/OrderPanel';
import { PrintPlacement } from '../components/designer/PrintPlacement';
import { ShirtOptions } from '../components/designer/ShirtOptions';
import { ViewerPanel } from '../components/designer/ViewerPanel';
import type { ViewRequest } from '../components/viewer/CameraRig';

export function StudioPage() {
  const [view, setView] = useState<ViewRequest>({ angle: 0, nonce: 0 });
  const turnTo = (angle: number) => setView((v) => ({ angle, nonce: v.nonce + 1 }));

  return (
    <div className="studio">
      <div className="studio__viewer">
        <ViewerPanel view={view} onView={turnTo} />
      </div>
      <div className="studio__panel">
        <ShirtOptions />
        <PrintPlacement onShowSide={(side) => turnTo(side === 'front' ? 0 : Math.PI)} />
        <OrderPanel />
      </div>
    </div>
  );
}
