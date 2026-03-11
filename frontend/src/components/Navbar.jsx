import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [open, setOpen] = useState(false);

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
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
