import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import './Dashboard.css';

function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { fetcher } = useApi();

  const finesQuery = useQuery({
    queryKey: ['dashboard', 'fines'],
    queryFn: () => fetcher('/fines/my'),
    enabled: isAuthenticated && user?.role === 'driver',
    staleTime: 30_000,
  });

  const appointmentsQuery = useQuery({
    queryKey: ['dashboard', 'appointments'],
    queryFn: () => fetcher('/appointments/my?limit=20'),
    enabled: isAuthenticated && user?.role === 'driver',
    staleTime: 30_000,
  });

  const licenseQuery = useQuery({
    queryKey: ['dashboard', 'license'],
    queryFn: () => fetcher('/license/me'),
    enabled: isAuthenticated && user?.role === 'driver',
    staleTime: 60_000,
    retry: false,
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const fines = finesQuery.data?.data || [];
  const appointments = appointmentsQuery.data?.data || [];
  const unpaidFines = fines.filter((fine) => fine.status === 'unpaid');
  const outstanding = unpaidFines.reduce((sum, fine) => sum + Number(fine.amount || 0), 0);
  const upcoming = appointments
    .filter((appointment) => appointment.status === 'scheduled' && new Date(appointment.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const license = licenseQuery.data;

  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">MY OTD PORTAL</span>
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Driver'}.</h1>
          <p>Manage your licence, appointments and traffic fines from one place.</p>
        </div>
        <div className="dashboard-role">{user?.role || 'user'}</div>
      </section>

      {user?.role !== 'driver' ? (
        <section className="dashboard-panel">
          <h2>Operations dashboard</h2>
          <p>Your account is signed in as <strong>{user?.role}</strong>. Use the services below to access the parts of OTD currently available to your role.</p>
          <div className="dashboard-actions">
            <Link to="/operations" className="dashboard-action primary">Open Operations</Link>
            <Link to="/license-lookup" className="dashboard-action">License Lookup</Link>
            <Link to="/appointments" className="dashboard-action">Appointments</Link>
            <Link to="/fines" className="dashboard-action">Fines</Link>
          </div>
        </section>
      ) : (
        <>
          {(finesQuery.isLoading || appointmentsQuery.isLoading || licenseQuery.isLoading) && <Loading />}

          <section className="dashboard-stats">
            <div className="dashboard-stat"><span>Outstanding fines</span><strong>R{outstanding.toFixed(2)}</strong></div>
            <div className="dashboard-stat"><span>Unpaid fines</span><strong>{unpaidFines.length}</strong></div>
            <div className="dashboard-stat"><span>Appointments</span><strong>{appointments.length}</strong></div>
            <div className="dashboard-stat"><span>Licence</span><strong>{license?.status || 'N/A'}</strong></div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-panel">
              <div className="panel-heading"><h2>Licence</h2><Link to="/license-lookup">Lookup</Link></div>
              {licenseQuery.isError ? (
                <p className="dashboard-muted">No licence record is available yet.</p>
              ) : (
                <div className="license-summary">
                  <strong>{license?.licenseNumber || 'No licence number'}</strong>
                  <StatusBadge status={license?.status}>{license?.status || 'Unknown'}</StatusBadge>
                  <p>Expires: {license?.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'N/A'}</p>
                  <p>Classes: {license?.vehicleClasses?.join(', ') || 'N/A'}</p>
                </div>
              )}
            </div>

            <div className="dashboard-panel">
              <div className="panel-heading"><h2>Next appointment</h2><Link to="/appointments">Manage</Link></div>
              {upcoming ? (
                <div className="appointment-summary">
                  <strong>{upcoming.type === 'drivers' ? "Driver's Test" : "Learner's Permit Test"}</strong>
                  <p>{new Date(upcoming.date).toLocaleDateString()} at {upcoming.time || 'Time TBC'}</p>
                  {upcoming.testingCenter && <p>{upcoming.testingCenter}</p>}
                  <StatusBadge status={upcoming.status}>{upcoming.status}</StatusBadge>
                </div>
              ) : (
                <p className="dashboard-muted">No upcoming appointment. Book your next test when you're ready.</p>
              )}
            </div>

            <div className="dashboard-panel dashboard-panel-wide">
              <div className="panel-heading"><h2>Recent fines</h2><Link to="/fines">View all</Link></div>
              {finesQuery.isError ? (
                <p className="dashboard-muted">Fines could not be loaded. Please try again.</p>
              ) : fines.length === 0 ? (
                <p className="dashboard-muted">You're all clear. No fines are recorded on your account.</p>
              ) : (
                <div className="fine-summary-list">
                  {fines.slice(0, 4).map((fine) => (
                    <div className="fine-summary" key={fine._id || fine.id}>
                      <div><strong>R{Number(fine.amount || 0).toFixed(2)}</strong><span>{fine.description || 'Traffic fine'}</span></div>
                      <StatusBadge status={fine.status}>{fine.status}</StatusBadge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="dashboard-actions">
            <Link to="/appointments" className="dashboard-action primary">Book an appointment</Link>
            <Link to="/fines" className="dashboard-action">Manage fines</Link>
            <Link to="/license-lookup" className="dashboard-action">Check licence</Link>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
