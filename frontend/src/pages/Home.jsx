import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const quickStats = [
  { label: 'Digital Services', value: '24/7' },
  { label: 'Easy Registration', value: '1 min' },
  { label: 'Secure Access', value: '24/7' }
];

function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="home">
      <section className="hero card border-0 text-white overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <span className="badge rounded-pill text-bg-light text-primary mb-3">Online Traffic Division</span>
          <h1 className="display-4 fw-bold">Your traffic services, online.</h1>
          <p className="lead mb-4">Create your OTD account to manage your licence, appointments and traffic fines from one secure portal.</p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/register" className="btn btn-light btn-lg px-4">Create an account</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">Sign in</Link>
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
        <div className="col-md-4"><div className="feature-card card h-100 border-0 shadow-sm"><div className="card-body p-4"><h3 className="h4">Licence services</h3><p className="text-muted mb-0">Access your licence information and important details.</p></div></div></div>
        <div className="col-md-4"><div className="feature-card card h-100 border-0 shadow-sm"><div className="card-body p-4"><h3 className="h4">Appointments</h3><p className="text-muted mb-0">Schedule learner and driver testing appointments online.</p></div></div></div>
        <div className="col-md-4"><div className="feature-card card h-100 border-0 shadow-sm"><div className="card-body p-4"><h3 className="h4">Traffic fines</h3><p className="text-muted mb-0">View and manage traffic fines associated with your account.</p></div></div></div>
      </section>
    </div>
  );
}

export default Home;
