import { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark otd-navbar sticky-top">
      <div className="container navbar-wrap">
        <Link to="/" className="navbar-brand fw-bold" onClick={() => setOpen(false)}>
          🚦 OTD
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto gap-lg-2">
            <li className="nav-item"><NavLink to="/" className="nav-link" onClick={() => setOpen(false)}>Home</NavLink></li>
            <li className="nav-item"><NavLink to="/license-lookup" className="nav-link" onClick={() => setOpen(false)}>License Lookup</NavLink></li>
            <li className="nav-item"><NavLink to="/appointments" className="nav-link" onClick={() => setOpen(false)}>Appointments</NavLink></li>
            <li className="nav-item"><NavLink to="/fines" className="nav-link" onClick={() => setOpen(false)}>Fines</NavLink></li>
            {isAuthenticated && user?.role === 'driver' && (
              <li className="nav-item"><NavLink to="/driver" className="nav-link" onClick={() => setOpen(false)}>Driver</NavLink></li>
            )}
            {isAuthenticated && (user?.role === 'officer' || user?.role === 'admin') && (
              <li className="nav-item"><NavLink to="/officer" className="nav-link" onClick={() => setOpen(false)}>Officer</NavLink></li>
            )}
            {!isAuthenticated ? (
              <li className="nav-item"><NavLink to="/login" className="nav-link" onClick={() => setOpen(false)}>Login</NavLink></li>
            ) : (
              <li className="nav-item">
                <button className="nav-link nav-button" onClick={() => { setOpen(false); logout(); }}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
