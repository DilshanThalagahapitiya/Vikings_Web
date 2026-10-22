import { Link, NavLink } from 'react-router-dom';
import { APP_NAME } from '../../config/app';
import { useCartStore } from '../../store/cartStore';

export function Header() {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={32} height={32} />
          {APP_NAME}
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Design studio
          </NavLink>
          <NavLink to="/cart">
            Cart{count > 0 && <span className="badge">{count}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
