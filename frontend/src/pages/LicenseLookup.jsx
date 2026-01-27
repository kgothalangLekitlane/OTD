import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import Loading from '../components/Loading';
import './LicenseLookup.css';

function LicenseLookup() {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [result, setResult] = useState(null);
  const { request, loading, error } = useApi();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!licenseNumber.trim()) return;

    try {
      const data = await request('GET', `/licenses/${licenseNumber}`);
      setResult(data);
    } catch (err) {
      setResult(null);
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

      {error && <div className="error-message">{error}</div>}
      
      {loading && <Loading />}

      {result && (
        <div className="result">
          <h2>License Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>License Number:</strong>
              <p>{result.number}</p>
            </div>
            <div className="info-item">
              <strong>Status:</strong>
              <p>{result.status}</p>
            </div>
            <div className="info-item">
              <strong>Expiry Date:</strong>
              <p>{new Date(result.expiryDate).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <strong>Class:</strong>
              <p>{result.class}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LicenseLookup;
