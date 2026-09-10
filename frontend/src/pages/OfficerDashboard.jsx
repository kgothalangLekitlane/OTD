import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import StatusBadge from '../components/StatusBadge';
import './OfficerDashboard.css';

function OfficerDashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { request } = useApi();
  const [idNumber, setIdNumber] = useState('');
  const [driver, setDriver] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [fine, setFine] = useState({ amount: '', description: '' });

  const lookup = useMutation({
    mutationFn: (value) => request('GET', `/license/lookup/${encodeURIComponent(value)}`),
    onSuccess: (data) => { setDriver(data); setLookupError(''); },
    onError: (error) => { setDriver(null); setLookupError(error.response?.data?.message || 'Driver lookup failed.'); }
  });

  const issueFine = useMutation({
    mutationFn: (payload) => request('POST', '/fines/issue', payload),
    onSuccess: () => setFine({ amount: '', description: '' })
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
    </div>
  );
}

export default OfficerDashboard;
