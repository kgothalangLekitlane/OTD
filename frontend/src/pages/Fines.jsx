import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FineCard from '../components/FineCard';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import './Fines.css';

function Fines() {
  const [filter, setFilter] = useState('all');
  const { fetcher, request, loading: apiLoading, error } = useApi();
  const queryClient = useQueryClient();

  const finesQuery = useQuery({
    queryKey: ['myFines'],
    queryFn: () => fetcher('/fines/my'),
    staleTime: 30_000,
  });
  const fines = finesQuery.data?.data || [];

  const payMutation = useMutation({
    mutationFn: (fineId) => request('POST', `/fines/pay/${fineId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myFines'] }),
  });

  const filteredFines = filter === 'all' ? fines : fines.filter(fine => {
    const status = String(fine.status || '').toLowerCase();
    if (filter === 'pending') return status === 'unpaid' || status === 'pending';
    return status === filter;
  });

  const displayLoading = apiLoading || finesQuery.isLoading;
  const displayError = error || (finesQuery.isError ? 'Failed to load fines. Please refresh and try again.' : null);
  const unpaidCount = fines.filter(fine => ['unpaid', 'pending'].includes(String(fine.status || '').toLowerCase())).length;

  const payFine = async (fineId) => {
    if (!window.confirm('Mark this fine as paid? This demo payment flow records the payment in OTD.')) return;
    try { await payMutation.mutateAsync(fineId); } catch (err) { /* feedback rendered below */ }
  };

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
        </select>
      </div>
      {displayError && <div className="error-message" role="alert">{displayError}</div>}
      {payMutation.isError && <div className="error-message" role="alert">{payMutation.error?.response?.data?.message || payMutation.error?.message || 'Payment failed. Please try again.'}</div>}
      {displayLoading && <Loading />}
      {!displayLoading && !displayError && filteredFines.length === 0 && <EmptyState title={filter === 'all' ? 'No fines found' : `No ${filter} fines`} message={filter === 'all' ? 'You currently have no traffic fines on your account.' : 'Try another status filter.'} />}
      <div className="fines-list">
        {filteredFines.map(fine => (
          <div key={fine._id || fine.id}>
            <FineCard fine={fine} />
            <div className="d-flex align-items-center justify-content-between gap-2 mt-2 mb-3">
              <StatusBadge status={fine.status}>{fine.status || 'Unknown'}</StatusBadge>
              {fine.status === 'unpaid' && <button type="button" className="btn btn-primary btn-sm" onClick={() => payFine(fine._id || fine.id)} disabled={payMutation.isPending}>{payMutation.isPending ? 'Processing...' : 'Pay fine'}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Fines;
