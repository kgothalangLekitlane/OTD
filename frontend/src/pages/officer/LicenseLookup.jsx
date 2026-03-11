import { useState } from "react";
import api from "../../api";

export default function LicenseLookup() {
  const [idNumber, setIdNumber] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.get(`/license/lookup/${idNumber}`);
      setData(res.data);
    } catch {
      setError('Lookup failed');
      setData(null);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">Officer License Lookup</h2>

        <form onSubmit={search}>
          <input className="otd-input" placeholder="Enter ID Number" value={idNumber} onChange={e => setIdNumber(e.target.value)} required />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        {error && <p style={{ color: '#dc2626' }}>{error}</p>}

        {data && (
          <pre className="card" style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
