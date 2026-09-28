import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const closeMenu = () => setOpen(false);

  if (isAuthenticated) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark otd-navbar sticky-top">
      <div className="container navbar-wrap">
        <Link to="/" className="navbar-brand fw-bold" onClick={closeMenu}>🚦 OTD</Link>
        <button className="navbar-toggler" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen((v) => !v)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={"navbar-collapse" + (open ? " show" : "")}>
          <ul className="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
            <li className="nav-item"><NavLink to="/" className="nav-link" onClick={closeMenu}>Home</NavLink></li>
            <li className="nav-item"><NavLink to="/login" className="nav-link" onClick={closeMenu}>Sign in</NavLink></li>
            <li className="nav-item ms-lg-1"><Link to="/register" className="btn btn-light btn-sm px-3" onClick={closeMenu}>Register</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
