import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import './LicenseLookup.css';

function LicenseLookup() {
  const [licenseNumber, setLicenseNumber] = useState('');
  const { fetcher, loading, error } = useApi();

  const { data: result, refetch, isFetching, isError, error: queryError } = useQuery({
    queryKey: ['licenseLookup', licenseNumber],
    queryFn: () => fetcher(`/license/lookup/${encodeURIComponent(licenseNumber.trim())}`),
    enabled: false,
    staleTime: 60_000,
    retry: false,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!licenseNumber.trim()) return;
    await refetch();
  };

  return (
    <div className="license-lookup">
      <h1>License Lookup</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input type="text" placeholder="Enter ID number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="search-input" aria-label="ID number" required />
        <button type="submit" className="search-btn" disabled={isFetching}> {isFetching ? 'Searching...' : 'Search'} </button>
      </form>

      {(isError || error) && <div className="error-message" role="alert">{queryError?.response?.data?.message || error || 'Lookup failed. Please check the ID number and try again.'}</div>}
      {(isFetching || loading) && <Loading />}

      {result && (
        <div className="result">
          <h2>License Information</h2>
          <div className="info-grid">
            <div className="info-item"><strong>Driver:</strong><p>{result.user?.name || 'N/A'}</p></div>
            <div className="info-item"><strong>License Number:</strong><p>{result.license?.licenseNumber || 'N/A'}</p></div>
            <div className="info-item"><strong>Status:</strong><p><StatusBadge status={result.license?.status}>{result.license?.status || 'N/A'}</StatusBadge></p></div>
            <div className="info-item"><strong>Expiry Date:</strong><p>{result.license?.expiryDate ? new Date(result.license.expiryDate).toLocaleDateString() : 'N/A'}</p></div>
            <div className="info-item"><strong>Classes:</strong><p>{result.license?.vehicleClasses?.join(', ') || 'N/A'}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LicenseLookup;
