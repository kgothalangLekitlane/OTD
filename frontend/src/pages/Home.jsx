import { Link } from 'react-router-dom';
import './Home.css';

const quickStats = [
  { label: 'Digital Services', value: '24/7' },
  { label: 'Average Response', value: '< 2 min' },
  { label: 'Secure APIs', value: '99.9%' }
];

function Home() {
  return (
    <div className="home">
      <section className="hero card border-0 text-white overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <span className="badge rounded-pill text-bg-light text-primary mb-3">Smart Traffic Platform</span>
          <h1 className="display-5 fw-bold">Welcome to Online Traffic Division</h1>
          <p className="lead mb-4">A modern, secure portal for licenses, appointments, and fine management.</p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/appointments" className="btn btn-light btn-lg">Book Appointment</Link>
            <Link to="/license-lookup" className="btn btn-outline-light btn-lg">Lookup License</Link>
          </div>
        </div>
        <div className="hero-glow" aria-hidden="true" />
      </section>

      <section className="stats-grid">
        {quickStats.map((item) => (
          <div key={item.label} className="stat-card card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="stat-value mb-1">{item.value}</h3>
              <p className="text-muted mb-0">{item.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="features row g-4">
        <div className="col-md-4">
          <div className="feature-card card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4">License Lookup</h3>
              <p className="text-muted">Check status, expiry date, and class information instantly.</p>
              <Link to="/license-lookup" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4">Book Appointments</h3>
              <p className="text-muted">Schedule learner and driver tests in a few quick steps.</p>
              <Link to="/appointments" className="btn btn-primary">Book Now</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="feature-card card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4">View & Pay Fines</h3>
              <p className="text-muted">Track your outstanding fines and complete payments securely.</p>
              <Link to="/fines" className="btn btn-primary">View Fines</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
