import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../context/ApiContext';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import './UserDirectory.css';

function UserDirectory() {
  const { fetcher } = useApi();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const users = useQuery({
    queryKey: ['operations-users', query, role, page],
    queryFn: () => fetcher(`/users?limit=10&page=${page}&search=${encodeURIComponent(query)}${role ? `&role=${role}` : ''}`),
    placeholderData: (previous) => previous,
  });

  const rows = users.data?.data || [];
  const totalPages = users.data?.pages || 1;

  return (
    <section className="officer-card user-directory">
      <div className="card-heading user-directory-heading">
        <div>
          <span className="dashboard-eyebrow">ADMINISTRATION</span>
          <h2>User directory</h2>
          <p>Search registered users by name, email or ID number.</p>
        </div>
        <strong className="user-count">{users.data?.total ?? '—'} users</strong>
      </div>

      <div className="user-filters">
        <label>
          Search
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email or ID number" />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => { setRole(event.target.value); setPage(1); }}>
            <option value="">All roles</option>
            <option value="driver">Drivers</option>
            <option value="officer">Officers</option>
            <option value="admin">Administrators</option>
          </select>
        </label>
      </div>

      {users.isError && <p className="officer-error" role="alert">{users.error?.response?.data?.message || 'Unable to load users.'}</p>}
      {users.isLoading && <p className="officer-muted">Loading users...</p>}
      {!users.isLoading && !users.isError && rows.length === 0 && <EmptyState title="No users found" message="Try a different search or role filter." />}

      {rows.length > 0 && (
        <div className="user-table-wrap">
          <table className="user-table">
            <thead><tr><th>Name</th><th>Email</th><th>ID number</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item._id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.email}</td>
                  <td>{item.idNumber}</td>
                  <td><StatusBadge status={item.role}>{item.role}</StatusBadge></td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="user-pagination">
          <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={page === 1 || users.isFetching}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(current + 1, totalPages))} disabled={page >= totalPages || users.isFetching}>Next</button>
        </div>
      )}
    </section>
  );
}

export default UserDirectory;
