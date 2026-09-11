import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import './LicenseLookup.css';

function LicenseLookup() {
  const [idNumber, setIdNumber] = useState('');
  const { fetcher } = useApi();

  const lookupQuery = useQuery({
    queryKey: ['licenseLookup', idNumber.trim()],
    queryFn: () => fetcher(`/license/lookup/${encodeURIComponent(idNumber.trim())}`),
    enabled: false,
    staleTime: 60_000,
    retry: false,
  });

  const handleSearch = async (event) => {
    event.preventDefault();
    const value = idNumber.trim();
    if (!value) return;
    await lookupQuery.refetch();
  };

  const result = lookupQuery.data;
  const errorMessage = lookupQuery.error?.response?.data?.message || lookupQuery.error?.message || 'No matching licence record was found.';

  return (
    <div className="license-lookup">
      <div className="page-heading">
        <span className="dashboard-eyebrow">OTD VERIFICATION</span>
        <h1>Licence Lookup</h1>
        <p>Search an authorised driver record using the driver's ID number.</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <label htmlFor="license-id" className="visually-hidden">Driver ID number</label>
        <input id="license-id" type="text" inputMode="numeric" autoComplete="off" placeholder="Enter ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="search-input" required />
        <button type="submit" className="search-btn" disabled={lookupQuery.isFetching}>
          {lookupQuery.isFetching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {lookupQuery.isError && <div className="error-message" role="alert">{errorMessage}</div>}
      {lookupQuery.isFetching && <Loading />}

      {result && !lookupQuery.isFetching && (
        <div className="result">
          <div className="result-heading">
            <div><span className="dashboard-eyebrow">VERIFIED RECORD</span><h2>Licence Information</h2></div>
            <StatusBadge status={result.license?.status}>{result.license?.status || 'Unknown'}</StatusBadge>
          </div>
          <div className="info-grid">
            <div className="info-item"><strong>Driver</strong><p>{result.user?.name || 'N/A'}</p></div>
            <div className="info-item"><strong>Licence Number</strong><p>{result.license?.licenseNumber || 'N/A'}</p></div>
            <div className="info-item"><strong>Status</strong><p>{result.license?.status || 'N/A'}</p></div>
            <div className="info-item"><strong>Expiry Date</strong><p>{result.license?.expiryDate ? new Date(result.license.expiryDate).toLocaleDateString() : 'N/A'}</p></div>
            <div className="info-item"><strong>Vehicle Classes</strong><p>{result.license?.vehicleClasses?.join(', ') || 'N/A'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LicenseLookup;
