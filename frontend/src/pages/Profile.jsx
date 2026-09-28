import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user } = useContext(AuthContext);
  return <div className="profile-page">
    <div className="page-heading"><span className="dashboard-eyebrow">ACCOUNT</span><h1>Profile</h1><p>View the personal information associated with your OTD account.</p></div>
    <section className="profile-card">
      <div className="profile-hero"><div className="profile-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div><div><h2>{user?.name || 'Account holder'}</h2><p>{user?.email || 'No email available'}</p><span className="profile-role">{user?.role || 'driver'}</span></div></div>
      <div className="profile-grid">
        <div><label>Full name</label><strong>{user?.name || 'Not available'}</strong></div><div><label>ID number</label><strong>{user?.idNumber || 'Not available'}</strong></div><div><label>Email address</label><strong>{user?.email || 'Not available'}</strong></div><div><label>Account role</label><strong>{user?.role || 'driver'}</strong></div>
      </div>
    </section>
  </div>;
}