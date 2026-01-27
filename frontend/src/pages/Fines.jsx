import { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import FineCard from '../components/FineCard';
import Loading from '../components/Loading';
import './Fines.css';

function Fines() {
  const [fines, setFines] = useState([]);
  const [filter, setFilter] = useState('all');
  const { request, loading, error } = useApi();

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const data = await request('GET', '/fines');
      setFines(data);
    } catch (err) {
      console.error('Failed to fetch fines');
    }
  };

  const filteredFines = filter === 'all' 
    ? fines 
    : fines.filter(fine => fine.status.toLowerCase() === filter.toLowerCase());

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

      {error && <div className="error-message">{error}</div>}
      
      {loading && <Loading />}

      {!loading && filteredFines.length === 0 && (
        <p className="no-data">No fines found</p>
      )}

      <div className="fines-list">
        {filteredFines.map(fine => (
          <FineCard key={fine.id} fine={fine} />
        ))}
      </div>
    </div>
  );
}

export default Fines;
