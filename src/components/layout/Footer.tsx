import { Link } from 'react-router-dom';
import { APP_NAME } from '../../config/app';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>
          © {new Date().getFullYear()} {APP_NAME} · Custom printed T-shirts
        </span>
        <Link to="/admin">Admin</Link>
      </div>
    </footer>
  );
}
