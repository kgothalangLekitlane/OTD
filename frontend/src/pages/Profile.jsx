import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'driver';
  const initial = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      <header className="profile-heading">
        <div><span className="dashboard-eyebrow">ACCOUNT</span><h1>Profile</h1><p>Manage and review the personal information associated with your OTD account.</p></div>
        <NavLink to="/dashboard" className="profile-back">← Dashboard</NavLink>
      </header>

      <section className="profile-card">
        <div className="profile-hero">
          <div className="profile-avatar">{initial}</div>
          <div className="profile-identity"><span className="profile-kicker">ACCOUNT HOLDER</span><h2>{user?.name || 'Account holder'}</h2><p>{user?.email || 'No email available'}</p><span className="profile-role">{role}</span></div>
        </div>
        <div className="profile-section-heading"><div><span>PERSONAL INFORMATION</span><h3>Account details</h3></div><small>Linked to your OTD account</small></div>
        <div className="profile-grid">
          <div><label>Full name</label><strong>{user?.name || 'Not available'}</strong></div>
          <div><label>ID number</label><strong>{user?.idNumber || 'Not available'}</strong></div>
          <div><label>Email address</label><strong>{user?.email || 'Not available'}</strong></div>
          <div><label>Account role</label><strong className="profile-role-value">{role}</strong></div>
        </div>
      </section>

      <section className="profile-actions">
        <div><span className="dashboard-eyebrow">QUICK ACCESS</span><h2>Account services</h2><p>Continue managing your OTD services from your dashboard.</p></div>
        <div className="profile-action-links"><NavLink to="/licensing">Licensing</NavLink><NavLink to="/appointments">Appointments</NavLink><NavLink to="/fines">Traffic fines</NavLink></div>
      </section>
    </div>
  );
}