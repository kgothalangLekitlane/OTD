import { NavLink } from 'react-router-dom';
import './Licensing.css';

export default function Licensing() {
  return <div className="licensing-page">
    <div className="page-heading"><span className="dashboard-eyebrow">OTD SERVICES</span><h1>Licensing</h1><p>Manage your driving licence information and access authorised verification services.</p></div>
    <div className="licensing-grid">
      <NavLink to="/licensing/my-licence" className="licensing-card"><span className="licensing-icon">✓</span><div><h2>My Licence</h2><p>View your licence number, status, expiry date and vehicle classes.</p></div><span className="card-arrow">→</span></NavLink>
      <NavLink to="/appointments" className="licensing-card"><span className="licensing-icon">▦</span><div><h2>Appointments</h2><p>Book and manage learner or driving licence appointments.</p></div><span className="card-arrow">→</span></NavLink>
      <NavLink to="/fines" className="licensing-card"><span className="licensing-icon">▤</span><div><h2>Traffic fines</h2><p>Review outstanding fines and manage available payments.</p></div><span className="card-arrow">→</span></NavLink>
    </div>
  </div>;
}