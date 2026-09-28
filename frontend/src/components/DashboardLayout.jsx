import { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './DashboardLayout.css';

const Icon = ({ children }) => <span className="sidebar-icon" aria-hidden="true">{children}</span>;

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isStaff = ['officer', 'admin'].includes(user?.role);
  const signOut = () => { logout(); navigate('/login', { replace: true }); };
  const linkClass = ({ isActive }) => 'dashboard-nav-link' + (isActive ? ' active' : '');

  return (
    <div className={"dashboard-shell"}>
      <aside className={"dashboard-sidebar" + (open ? " open" : "")}>
        <div className="sidebar-brand"><div className="sidebar-logo">OTD</div><div><strong>Online Traffic</strong><span>Division</span></div></div>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <NavLink to="/dashboard" end className={linkClass} onClick={() => setOpen(false)}><Icon>⌂</Icon>Dashboard</NavLink>
          <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}><Icon>◯</Icon>Profile</NavLink>
          <div className="nav-section">LICENSING</div>
          <NavLink to="/licensing" end className={linkClass} onClick={() => setOpen(false)}><Icon>▣</Icon>Licensing</NavLink>
          <NavLink to="/licensing/my-licence" className={linkClass} onClick={() => setOpen(false)}><Icon>✓</Icon>My Licence</NavLink>
          {isStaff && <NavLink to="/licensing/lookup" className={linkClass} onClick={() => setOpen(false)}><Icon>⌕</Icon>Licence Lookup</NavLink>}
          <div className="nav-section">SERVICES</div>
          <NavLink to="/appointments" className={linkClass} onClick={() => setOpen(false)}><Icon>▦</Icon>Appointments</NavLink>
          <NavLink to="/fines" className={linkClass} onClick={() => setOpen(false)}><Icon>▤</Icon>Fines</NavLink>
          {isStaff && <NavLink to="/operations" className={linkClass} onClick={() => setOpen(false)}><Icon>⚙</Icon>Operations</NavLink>}
        </nav>
        <div className="sidebar-bottom"><button type="button" className="dashboard-signout" onClick={signOut}><Icon>↪</Icon>Sign out</button></div>
      </aside>
      {open && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="mobile-menu" type="button" onClick={() => setOpen(true)} aria-label="Open navigation">☰</button>
          <div className="topbar-title">Online Traffic Division</div>
          <NavLink to="/profile" className="topbar-user"><span className="topbar-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</span><span>{user?.name || 'Account'}</span></NavLink>
        </header>
        <main className="dashboard-content"><Outlet /></main>
      </section>
    </div>
  );
}