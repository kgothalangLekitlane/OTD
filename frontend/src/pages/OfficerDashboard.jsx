import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import OperationsSummary from '../components/OperationsSummary';
import UserDirectory from '../components/UserDirectory';
import './OfficerDashboard.css';

function OfficerDashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { request, fetcher } = useApi();
  const queryClient = useQueryClient();
  const [idNumber, setIdNumber] = useState('');
  const [driver, setDriver] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [fine, setFine] = useState({ amount: '', description: '' });
  const [appointmentFilter, setAppointmentFilter] = useState('scheduled');

  const lookup = useMutation({
    mutationFn: (value) => request('GET', `/license/lookup/${encodeURIComponent(value)}`),
    onSuccess: (data) => { setDriver(data); setLookupError(''); },
    onError: (error) => { setDriver(null); setLookupError(error.response?.data?.message || 'Driver lookup failed.'); }
  });

  const issueFine = useMutation({
    mutationFn: (payload) => request('POST', '/fines/issue', payload),
    onSuccess: () => {
      setFine({ amount: '', description: '' });
      queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    }
  });

  const appointments = useQuery({
    queryKey: ['operations-appointments', appointmentFilter],
    queryFn: () => fetcher(`/appointments/all?limit=50${appointmentFilter ? `&status=${appointmentFilter}` : ''}`),
    enabled: isAuthenticated && ['officer', 'admin'].includes(user?.role)
  });

  const updateAppointment = useMutation({
    mutationFn: ({ id, status }) => request('PATCH', `/appointments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    }
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!['officer', 'admin'].includes(user?.role)) return <Navigate to="/dashboard" replace />;

  const handleLookup = (event) => {
    event.preventDefault();
    if (idNumber.trim()) lookup.mutate(idNumber.trim());
  };

  const handleFine = (event) => {
    event.preventDefault();
    if (!driver?.user?._id || user?.role !== 'officer') return;
    issueFine.mutate({ userId: driver.user._id, amount: Number(fine.amount), description: fine.description.trim() });
  };

  const appointmentRows = appointments.data?.data || [];

  return (
    <div className="officer-dashboard">
      <section className="officer-header">
        <div>
          <span className="dashboard-eyebrow">OTD OPERATIONS</span>
          <h1>{user.role === 'admin' ? 'Administration' : 'Officer Dashboard'}</h1>
          <p>Search driver records and manage traffic enforcement from one workspace.</p>
        </div>
        <div className="dashboard-role">{user.role}</div>
      </section>

      <OperationsSummary />

      {user.role === 'admin' && <UserDirectory />}

      <section className="officer-card">
        <h2>Driver lookup</h2>
        <form className="lookup-form" onSubmit={handleLookup}>
          <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter ID number" aria-label="Driver ID number" required />
          <button type="submit" disabled={lookup.isPending}>{lookup.isPending ? 'Searching...' : 'Search driver'}</button>
        </form>
        {lookupError && <p className="officer-error" role="alert">{lookupError}</p>}
      </section>

      {driver && (
        <section className="officer-grid">
          <div className="officer-card">
            <div className="card-heading"><h2>Driver record</h2><StatusBadge status={driver.license?.status}>{driver.license?.status || 'No licence'}</StatusBadge></div>
            <dl className="driver-details">
              <div><dt>Name</dt><dd>{driver.user?.name || '—'}</dd></div>
              <div><dt>ID number</dt><dd>{driver.user?.idNumber || '—'}</dd></div>
              <div><dt>Email</dt><dd>{driver.user?.email || '—'}</dd></div>
              <div><dt>Licence number</dt><dd>{driver.license?.licenseNumber || '—'}</dd></div>
              <div><dt>Expiry</dt><dd>{driver.license?.expiryDate ? new Date(driver.license.expiryDate).toLocaleDateString() : '—'}</dd></div>
              <div><dt>Vehicle classes</dt><dd>{driver.license?.vehicleClasses?.join(', ') || '—'}</dd></div>
            </dl>
          </div>

          <div className="officer-card">
            <h2>Issue fine</h2>
            {user.role === 'officer' ? (
              <form className="fine-form" onSubmit={handleFine}>
                <label>Amount<input type="number" min="0.01" step="0.01" value={fine.amount} onChange={(e) => setFine({ ...fine, amount: e.target.value })} required /></label>
                <label>Description<textarea maxLength="1000" value={fine.description} onChange={(e) => setFine({ ...fine, description: e.target.value })} placeholder="Reason for the fine" /></label>
                {issueFine.isError && <p className="officer-error" role="alert">{issueFine.error?.response?.data?.message || 'Unable to issue fine.'}</p>}
                {issueFine.isSuccess && <p className="officer-success">Fine issued successfully.</p>}
                <button type="submit" disabled={issueFine.isPending}>{issueFine.isPending ? 'Issuing...' : 'Issue fine'}</button>
              </form>
            ) : <p className="officer-muted">Administrators can review driver records here. Fine issuing is restricted to officers.</p>}
          </div>
        </section>
      )}

      <section className="officer-card appointments-panel">
        <div className="card-heading">
          <div><span className="dashboard-eyebrow">OPERATIONS</span><h2>Appointment management</h2></div>
          <select value={appointmentFilter} onChange={(e) => setAppointmentFilter(e.target.value)} aria-label="Filter appointments by status">
            <option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="">All</option>
          </select>
        </div>

        {appointments.isLoading && <p className="officer-muted">Loading appointments...</p>}
        {appointments.isError && <p className="officer-error" role="alert">{appointments.error?.response?.data?.message || 'Unable to load appointments.'}</p>}
        {!appointments.isLoading && !appointments.isError && appointmentRows.length === 0 && <EmptyState title="No appointments found" description="There are no appointments matching this status." />}

        {appointmentRows.length > 0 && (
          <div className="appointments-table-wrap">
            <table className="appointments-table">
              <thead><tr><th>Applicant</th><th>Type</th><th>Date</th><th>Time</th><th>Testing centre</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {appointmentRows.map((appointment) => {
                  const applicant = appointment.userId;
                  return (
                    <tr key={appointment._id}>
                      <td><strong>{applicant?.name || 'Unknown applicant'}</strong><small>{applicant?.idNumber || applicant?.email || '—'}</small></td>
                      <td>{appointment.type === 'drivers' ? 'Driver' : 'Learner'}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{appointment.time || '—'}</td>
                      <td>{appointment.testingCenter || '—'}</td>
                      <td><StatusBadge status={appointment.status}>{appointment.status}</StatusBadge></td>
                      <td>
                        {appointment.status === 'scheduled' ? (
                          <div className="appointment-actions">
                            <button type="button" onClick={() => updateAppointment.mutate({ id: appointment._id, status: 'completed' })} disabled={updateAppointment.isPending}>Complete</button>
                            <button type="button" className="secondary-action" onClick={() => updateAppointment.mutate({ id: appointment._id, status: 'cancelled' })} disabled={updateAppointment.isPending}>Cancel</button>
                          </div>
                        ) : appointment.status === 'cancelled' ? (
                          <button type="button" className="secondary-action" onClick={() => updateAppointment.mutate({ id: appointment._id, status: 'scheduled' })} disabled={updateAppointment.isPending}>Restore</button>
                        ) : (
                          <button type="button" className="secondary-action" onClick={() => updateAppointment.mutate({ id: appointment._id, status: 'scheduled' })} disabled={updateAppointment.isPending}>Reopen</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {updateAppointment.isError && <p className="officer-error" role="alert">{updateAppointment.error?.response?.data?.message || 'Unable to update appointment.'}</p>}
      </section>
    </div>
  );
}

export default OfficerDashboard;
