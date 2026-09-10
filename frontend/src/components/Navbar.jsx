import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark otd-navbar sticky-top">
      <div className="container navbar-wrap">
        <Link to="/" className="navbar-brand fw-bold" onClick={closeMenu}>🚦 OTD</Link>
        <button className="navbar-toggler" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen((v) => !v)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
            <li className="nav-item"><NavLink to="/" className="nav-link" onClick={closeMenu}>Home</NavLink></li>
            {isAuthenticated && <li className="nav-item"><NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</NavLink></li>}
            <li className="nav-item"><NavLink to="/license-lookup" className="nav-link" onClick={closeMenu}>License Lookup</NavLink></li>
            <li className="nav-item"><NavLink to="/appointments" className="nav-link" onClick={closeMenu}>Appointments</NavLink></li>
            <li className="nav-item"><NavLink to="/fines" className="nav-link" onClick={closeMenu}>Fines</NavLink></li>
            {isAuthenticated ? (
              <li className="nav-item d-flex align-items-center gap-2 ms-lg-2">
                <span className="navbar-user">{user?.name || 'Account'}</span>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={() => { closeMenu(); logout(); }}>Sign out</button>
              </li>
            ) : (
              <li className="nav-item"><NavLink to="/login" className="nav-link" onClick={closeMenu}>Sign in</NavLink></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
