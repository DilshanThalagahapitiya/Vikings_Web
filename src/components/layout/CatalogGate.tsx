import { useEffect, type ReactNode } from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import { Button } from '../ui/Button';
import { Notice } from '../ui/Notice';

/** Loads the catalog once and renders children only when it is ready. */
export function CatalogGate({ children }: { children: ReactNode }) {
  const { status, error, load } = useCatalogStore();
  useEffect(() => {
    void load();
  }, [load]);

  if (status === 'error') {
    return (
      <div className="center">
        <Notice tone="error">Could not load the catalog: {error}</Notice>
        <Button onClick={() => void load()}>Try again</Button>
      </div>
    );
  }
  if (status !== 'ready') return <div className="center muted">Loading catalog…</div>;
  return <>{children}</>;
}
