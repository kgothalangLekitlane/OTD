import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Online Traffic Division</h1>
        <p>Manage your licenses, fines, and appointments online</p>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>License Lookup</h3>
          <p>Check your license information and status</p>
          <Link to="/license-lookup" className="btn">Get Started</Link>
        </div>

        <div className="feature-card">
          <h3>Book Appointments</h3>
          <p>Schedule appointments for license renewal or tests</p>
          <Link to="/appointments" className="btn">Book Now</Link>
        </div>

        <div className="feature-card">
          <h3>View Fines</h3>
          <p>Check and pay your traffic fines online</p>
          <Link to="/fines" className="btn">View Fines</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
