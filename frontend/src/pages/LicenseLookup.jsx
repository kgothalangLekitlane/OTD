import { useContext, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { AuthContext } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import './LicenseLookup.css';

function LicenseDetails({ result }) {
  const license = result?.license;

  return (
    <div className="result">
      <div className="licence-card-top">
        <div><span className="licence-card-label">OTD DIGITAL LICENCE</span><strong>{license?.licenseNumber || 'Licence record'}</strong></div>
        <StatusBadge status={license?.status}>{license?.status || 'Unknown'}</StatusBadge>
      </div>
      <div className="result-heading">
        <div>
          <span className="dashboard-eyebrow">VERIFIED RECORD</span>
          <h2>Licence Information</h2>
        </div>
      </div>
      <div className="info-grid">
        <div className="info-item"><strong>Driver</strong><p>{result?.user?.name || 'N/A'}</p></div>
        <div className="info-item"><strong>ID number</strong><p>{result?.user?.idNumber || 'N/A'}</p></div>
        <div className="info-item"><strong>Licence Number</strong><p>{license?.licenseNumber || 'N/A'}</p></div>
        <div className="info-item"><strong>Status</strong><p>{license?.status || 'N/A'}</p></div>
        <div className="info-item"><strong>Expiry Date</strong><p>{license?.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'N/A'}</p></div>
        <div className="info-item"><strong>Vehicle Classes</strong><p>{license?.vehicleClasses?.join(', ') || 'N/A'}</p></div>
      </div>
    </div>
  );
}

function LicenseLookup() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [idNumber, setIdNumber] = useState('');
  const { fetcher } = useApi();

  const ownLicenseQuery = useQuery({
    queryKey: ['license', 'me'],
    queryFn: () => fetcher('/license/me'),
    enabled: isAuthenticated && user?.role === 'driver',
    staleTime: 60_000,
    retry: false,
  });

  const lookupQuery = useQuery({
    queryKey: ['licenseLookup', idNumber.trim()],
    queryFn: () => fetcher(`/license/lookup/${encodeURIComponent(idNumber.trim())}`),
    enabled: false,
    staleTime: 60_000,
    retry: false,
  });

  const isStaff = ['officer', 'admin'].includes(user?.role);
  const result = isStaff ? lookupQuery.data : ownLicenseQuery.data;
  const activeError = isStaff ? lookupQuery.error : ownLicenseQuery.error;
  const isLoading = isStaff ? lookupQuery.isFetching : ownLicenseQuery.isLoading;
  const errorMessage = activeError?.response?.data?.message || activeError?.message || 'No licence record was found.';

  const handleSearch = async (event) => {
    event.preventDefault();
    const value = idNumber.trim();
    if (!value) return;
    await lookupQuery.refetch();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="license-lookup">
      <div className="page-heading">
        <span className="dashboard-eyebrow">OTD VERIFICATION</span>
        <h1>{isStaff ? 'Licence Lookup' : 'My Licence'}</h1>
        <p>{isStaff ? "Search an authorised driver record using the driver's ID number." : 'View the licence information linked to your OTD account.'}</p>
      </div>

      {isStaff && (
        <form onSubmit={handleSearch} className="search-form">
          <label htmlFor="license-id" className="visually-hidden">Driver ID number</label>
          <input id="license-id" type="text" inputMode="numeric" autoComplete="off" placeholder="Enter ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="search-input" required />
          <button type="submit" className="search-btn" disabled={lookupQuery.isFetching}>
            {lookupQuery.isFetching ? 'Searching...' : 'Search'}
          </button>
        </form>
      )}

      {activeError && <div className="error-message" role="alert">{errorMessage}</div>}
      {isLoading && <Loading />}
      {result && !isLoading && <LicenseDetails result={result} />}
      {!isLoading && !activeError && !result && (
        <div className="result">
          <h2>{isStaff ? 'Search a driver' : 'No licence record yet'}</h2>
          <p>{isStaff ? 'Enter a driver ID number above to view the authorised record.' : 'Your account does not have a licence record available yet.'}</p>
        </div>
      )}
    </div>
  );
}

export default LicenseLookup;