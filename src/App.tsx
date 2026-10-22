import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { CatalogGate } from './components/layout/CatalogGate';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';
import { StudioPage } from './pages/StudioPage';

/** HashRouter keeps deep links working on GitHub Pages (no server rewrites). */
export default function App() {
  return (
    <HashRouter>
      <CatalogGate>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<StudioPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </CatalogGate>
    </HashRouter>
  );
}
