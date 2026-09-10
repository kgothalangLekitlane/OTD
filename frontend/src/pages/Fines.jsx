import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useQuery } from '@tanstack/react-query';
import FineCard from '../components/FineCard';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import './Fines.css';

function Fines() {
  const [filter, setFilter] = useState('all');
  const { fetcher, loading: apiLoading, error } = useApi();

  const { data: finesResult = { data: [] }, isLoading, isError } = useQuery({
    queryKey: ['myFines'],
    queryFn: () => fetcher('/fines/my'),
    staleTime: 30_000,
  });
  const fines = finesResult.data || [];

  const filteredFines = filter === 'all' ? fines : fines.filter(fine => {
    const status = String(fine.status || '').toLowerCase();
    if (filter === 'pending') return status === 'unpaid' || status === 'pending';
    return status === filter;
  });

  const displayLoading = apiLoading || isLoading;
  const displayError = error || (isError ? 'Failed to load fines. Please refresh and try again.' : null);
  const unpaidCount = fines.filter(fine => ['unpaid', 'pending'].includes(String(fine.status || '').toLowerCase())).length;

  return (
    <div className="fines">
      <h1>Traffic Fines</h1>
      <p>Review your traffic fines and payment status.</p>
      <div className="fines-filter">
        <label htmlFor="fine-status-filter">Filter by status:</label>
        <select id="fine-status-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Fines ({fines.length})</option>
          <option value="pending">Pending ({unpaidCount})</option>
          <option value="paid">Paid</option>
          <option value="disputed">Disputed</option>
        </select>
      </div>
      {displayError && <div className="error-message" role="alert">{displayError}</div>}
      {displayLoading && <Loading />}
      {!displayLoading && !displayError && filteredFines.length === 0 && (
        <EmptyState title={filter === 'all' ? 'No fines found' : `No ${filter} fines`} message={filter === 'all' ? 'You currently have no traffic fines on your account.' : 'Try another status filter.'} />
      )}
      <div className="fines-list">
        {filteredFines.map(fine => (
          <div key={fine._id || fine.id}>
            <FineCard fine={fine} />
            <div className="fine-status-label"><StatusBadge status={fine.status}>{fine.status || 'Unknown'}</StatusBadge></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Fines;
