import { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './DashboardLayout.css';

const Icon = ({ children }) => <span className="sidebar-icon" aria-hidden="true">{children}</span>;

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isStaff = ['officer', 'admin'].includes(user?.role);
  const signOut = () => { logout(); navigate('/login', { replace: true }); };
  const linkClass = ({ isActive }) => 'dashboard-nav-link' + (isActive ? ' active' : '');

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <NavLink to="/dashboard" className="topbar-brand" aria-label="OTD dashboard">
            <span className="topbar-logo">OTD</span>
            <span><strong>Online Traffic</strong><small>Division</small></span>
          </NavLink>

          <nav className="topbar-nav" aria-label="Primary navigation">
            <NavLink to="/dashboard" end className={linkClass}>Dashboard</NavLink>
            <NavLink to="/licensing" className={linkClass}>Licensing</NavLink>
            <NavLink to="/appointments" className={linkClass}>Appointments</NavLink>
            <NavLink to="/fines" className={linkClass}>Fines</NavLink>
            {isStaff && <NavLink to="/operations" className={linkClass}>Operations</NavLink>}
          </nav>

          <div className="topbar-account">
            <NavLink to="/profile" className="topbar-user">
              <span className="topbar-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</span>
              <span className="topbar-user-name">{user?.name || 'Account'}</span>
            </NavLink>
            <button type="button" className="topbar-signout" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-frame">
        <aside className="dashboard-sidebar" aria-label="Account navigation">
          <div className="sidebar-card">
            <div className="sidebar-profile">
              <div className="sidebar-profile-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
              <div><strong>{user?.name || 'Account'}</strong><span>{user?.role || 'driver'}</span></div>
            </div>
            <nav className="dashboard-nav">
              <NavLink to="/dashboard" end className={linkClass}><Icon>⌂</Icon>Dashboard</NavLink>
              <NavLink to="/profile" className={linkClass}><Icon>◯</Icon>Profile</NavLink>
              <NavLink to="/licensing/my-licence" className={linkClass}><Icon>✓</Icon>My Licence</NavLink>
              {isStaff && <NavLink to="/licensing/lookup" className={linkClass}><Icon>⌕</Icon>Licence Lookup</NavLink>}
              <NavLink to="/appointments" className={linkClass}><Icon>▦</Icon>Appointments</NavLink>
              <NavLink to="/fines" className={linkClass}><Icon>▤</Icon>Fines</NavLink>
              <NavLink to="/licensing" className={linkClass}><Icon>▣</Icon>Services</NavLink>
              {isStaff && <NavLink to="/operations" className={linkClass}><Icon>⚙</Icon>Operations</NavLink>}
            </nav>
          </div>
          <div className="sidebar-help">
            <span>OTD PORTAL</span>
            <strong>Manage your traffic services in one place.</strong>
            <NavLink to="/licensing">Explore services →</NavLink>
          </div>
        </aside>

        <section className="dashboard-main">
          <div className="dashboard-content"><Outlet /></div>
        </section>
      </main>
    </div>
  );
}