import { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './DashboardLayout.css';

const Icon = ({ children }) => <span className="sidebar-icon" aria-hidden="true">{children}</span>;

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isStaff = ['officer', 'admin'].includes(user?.role);
  const signOut = () => { logout(); navigate('/login', { replace: true }); };
  const linkClass = ({ isActive }) => 'dashboard-nav-link' + (isActive ? ' active' : '');
  const closeMobile = () => setMobileOpen(false);

  const navigation = [
    ['/dashboard', 'Dashboard', '⌂', true],
    ['/profile', 'Profile', '◯', false],
    ['/licensing/my-licence', 'My Licence', '✓', false],
    ...(isStaff ? [['/licensing/lookup', 'Licence Lookup', '⌕', false]] : []),
    ['/appointments', 'Appointments', '▦', false],
    ['/fines', 'Fines', '▤', false],
    ['/licensing', 'Services', '▣', false],
    ...(isStaff ? [['/operations', 'Operations', '⚙', false]] : [])
  ];

  const NavItems = ({ mobile = false }) => (
    <nav className={mobile ? 'mobile-nav-list' : 'dashboard-nav'} aria-label={mobile ? 'Mobile navigation' : 'Account navigation'}>
      {navigation.map(([to, label, icon, end]) => (
        <NavLink key={to} to={to} end={end} className={mobile ? 'mobile-nav-link' : linkClass} onClick={mobile ? closeMobile : undefined}>
          <Icon>{icon}</Icon>{label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <NavLink to="/dashboard" className="topbar-brand" aria-label="OTD dashboard" onClick={closeMobile}>
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
            <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(v => !v)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        {mobileOpen && <div id="mobile-navigation" className="mobile-navigation"><NavItems mobile /></div>}
      </header>

      <main className="dashboard-frame">
        <aside className="dashboard-sidebar" aria-label="Account navigation">
          <div className="sidebar-card">
            <div className="sidebar-profile">
              <div className="sidebar-profile-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
              <div><strong>{user?.name || 'Account'}</strong><span>{user?.role || 'driver'}</span></div>
            </div>
            <NavItems />
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
