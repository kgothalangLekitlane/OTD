import { useState, useEffect } from "react";
import api from "../../api";

export default function MyFines() {
  const [fines, setFines] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/fines/my");
        setFines(res.data?.data || []);
      } catch {
        setError('Failed to load fines');
      }
    };
    load();
  }, []);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">My Fines</h2>
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        {fines.length === 0 && !error && <p>No fines found.</p>}

        {fines.map(f => (
          <div key={f._id} className="card" style={{ marginBottom: '.8rem', border: '1px solid #e2e8f0' }}>
            <div className="card-body">
              <p><strong>Description:</strong> {f.description || 'N/A'}</p>
              <p><strong>Amount:</strong> R{f.amount}</p>
              <p><strong>Status:</strong> {f.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
