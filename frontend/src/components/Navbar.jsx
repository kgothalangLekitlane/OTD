import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          OTD
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/license-lookup" className="nav-link">License Lookup</Link>
          </li>
          <li className="nav-item">
            <Link to="/appointments" className="nav-link">Appointments</Link>
          </li>
          <li className="nav-item">
            <Link to="/fines" className="nav-link">Fines</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
