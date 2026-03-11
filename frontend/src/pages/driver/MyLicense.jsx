import { useEffect, useState } from "react";
import api from "../../api";

export default function MyLicense() {
  const [license, setLicense] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/license/me");
        setLicense(res.data);
      } catch {
        setError('Failed to load license');
      }
    };
    load();
  }, []);

  if (!license && !error) return <p className="p-4">Loading License...</p>;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">My License</h2>
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        {license && (
          <div>
            <p><strong>License Number:</strong> {license.licenseNumber || 'N/A'}</p>
            <p><strong>Status:</strong> {license.status || 'N/A'}</p>
            <p><strong>Expiry Date:</strong> {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Vehicle Classes:</strong> {(license.vehicleClasses || []).join(", ") || 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
