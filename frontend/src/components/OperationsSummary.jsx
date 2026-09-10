import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../context/ApiContext';
import './OperationsSummary.css';

function Metric({ label, value, detail }) {
  return (
    <div className="operations-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export default function OperationsSummary() {
  const { user } = useContext(AuthContext);
  const { fetcher } = useApi();
  const enabled = ['officer', 'admin'].includes(user?.role);

  const summary = useQuery({
    queryKey: ['operations-summary'],
    queryFn: () => fetcher('/dashboard/operations'),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  if (!enabled) return null;
  if (summary.isLoading) return <section className="operations-summary"><p className="operations-muted">Loading operational metrics...</p></section>;
  if (summary.isError) return <section className="operations-summary"><p className="operations-error">Operational metrics could not be loaded.</p></section>;

  const data = summary.data;
  const money = (amount) => `R${Number(amount || 0).toFixed(2)}`;

  return (
    <section className="operations-summary" aria-label="Operational summary">
      <div className="operations-summary-heading">
        <div>
          <span className="dashboard-eyebrow">SYSTEM OVERVIEW</span>
          <h2>{user.role === 'admin' ? 'Administration overview' : 'Operations overview'}</h2>
        </div>
        <small>Updated {data.generatedAt ? new Date(data.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}</small>
      </div>

      <div className="operations-metrics-grid">
        <Metric label="Total users" value={data.users.total} detail={`${data.users.drivers} drivers · ${data.users.officers} officers`} />
        <Metric label="Upcoming appointments" value={data.appointments.upcoming} detail={`${data.appointments.scheduled} scheduled overall`} />
        <Metric label="Unpaid fines" value={data.fines.unpaid} detail={`${money(data.fines.unpaidAmount)} outstanding`} />
        <Metric label="Paid fines" value={data.fines.paid} detail={money(data.fines.paidAmount)} />
        <Metric label="Valid licences" value={data.licenses.valid} detail={`${data.licenses.expired} expired · ${data.licenses.suspended} suspended`} />
        <Metric label="Total appointments" value={data.appointments.total} detail={`${data.appointments.completed} completed · ${data.appointments.cancelled} cancelled`} />
      </div>
    </section>
  );
}
