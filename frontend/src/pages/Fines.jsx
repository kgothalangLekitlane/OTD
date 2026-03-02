import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useQuery } from '@tanstack/react-query';
import FineCard from '../components/FineCard';
import Loading from '../components/Loading';
import './Fines.css';

function Fines() {
  const [filter, setFilter] = useState('all');
  const { request, fetcher, loading: apiLoading, error } = useApi();

  const { data: finesResult = { data: [] }, isLoading, isError, refetch } = useQuery(
    ['myFines'],
    () => fetcher('/fines/my'),
    { staleTime: 30_000 }
  );
  const fines = finesResult.data || [];

  // normalize statuses: backend uses 'unpaid'|'paid'
  const filteredFines = filter === 'all'
    ? fines
    : fines.filter(fine => {
      const s = (fine.status || '').toLowerCase();
      if (filter === 'pending') return s === 'unpaid' || s === 'pending';
      return s === filter.toLowerCase();
    });

  const displayLoading = apiLoading || isLoading;
  const displayError = error || (isError && 'Failed to load fines');

  return (
    <div className="fines">
      <h1>Traffic Fines</h1>

      <div className="fines-filter">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Fines</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="disputed">Disputed</option>
        </select>
      </div>

      {displayError && <div className="error-message">{displayError}</div>}
      
      {displayLoading && <Loading />}

      {!displayLoading && filteredFines.length === 0 && (
        <p className="no-data">No fines found</p>
      )}

      <div className="fines-list">
        {filteredFines.map(fine => (
          <FineCard key={fine._id || fine.id} fine={fine} />
        ))}
      </div>
    </div>
  );
}

export default Fines;
