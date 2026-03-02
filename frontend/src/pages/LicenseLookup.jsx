import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import './LicenseLookup.css';

function LicenseLookup() {
  const [licenseNumber, setLicenseNumber] = useState('');
  const { request, fetcher, loading, error } = useApi();

  const { data: result, refetch, isFetching, isError } = useQuery(
    ['licenseLookup', licenseNumber],
    () => fetcher(`/license/lookup/${licenseNumber}`),
    { enabled: false, staleTime: 60_000 }
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!licenseNumber.trim()) return;
    try {
      await refetch();
    } catch (err) {
      // error handled by query
    }
  };

  return (
    <div className="license-lookup">
      <h1>License Lookup</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter license number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      {(isError || error) && <div className="error-message">
        {isError ? 'Lookup failed' : error}
      </div>}
      
      {(isFetching || loading) && <Loading />}

      {result && (
        <div className="result">
          <h2>License Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>License Number:</strong>
              <p>{result.license?.licenseNumber || 'N/A'}</p>
            </div>
            <div className="info-item">
              <strong>Status:</strong>
              <p>{result.license?.status || 'N/A'}</p>
            </div>
            <div className="info-item">
              <strong>Expiry Date:</strong>
              <p>{result.license?.expiryDate ? new Date(result.license.expiryDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="info-item">
              <strong>Classes:</strong>
              <p>{(result.license?.vehicleClasses || []).join(', ') || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LicenseLookup;
