import { NavLink } from 'react-router-dom';
import './Licensing.css';

const services = [
  { to:'/licensing/my-licence', icon:'✓', title:'My Licence', text:'View your licence number, status, expiry date and vehicle classes.', action:'View licence' },
  { to:'/appointments', icon:'▦', title:'Appointments', text:'Book and manage learner or driving licence appointments.', action:'Manage appointments' },
  { to:'/fines', icon:'▤', title:'Traffic fines', text:'Review outstanding fines and manage available payments.', action:'View fines' }
];

export default function Licensing() {
  return (
    <div className="licensing-page">
      <header className="licensing-hero">
        <div>
          <span className="dashboard-eyebrow">OTD SERVICES</span>
          <h1>Licensing</h1>
          <p>Access your licence information and manage the services connected to your driving record.</p>
        </div>
        <div className="licensing-hero-badge">LICENSING PORTAL</div>
      </header>

      <section className="licensing-section">
        <div className="section-title">
          <div><span className="section-kicker">SERVICES</span><h2>What would you like to do?</h2></div>
          <span className="service-count">{services.length} services</span>
        </div>
        <div className="licensing-grid">
          {services.map((service) => (
            <NavLink key={service.to} to={service.to} className="licensing-card">
              <span className="licensing-icon">{service.icon}</span>
              <div><h3>{service.title}</h3><p>{service.text}</p></div>
              <span className="card-action">{service.action}<span>→</span></span>
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
}