import { useQuery } from '@tanstack/react-query';
import { useApi } from '../context/ApiContext';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import './AuditActivity.css';

const ACTION_LABELS = {
  'fine.issued': 'Fine issued',
  'fine.paid': 'Fine paid',
  'appointment.status_updated': 'Appointment status updated',
};

function formatAction(action) {
  return ACTION_LABELS[action] || action.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDetails(log) {
  const details = log.details || {};
  const parts = [];
  if (details.amount !== undefined) parts.push(`R${Number(details.amount).toFixed(2)}`);
  if (details.from && details.to) parts.push(`${details.from} → ${details.to}`);
  if (details.previousStatus && details.status && !details.from) parts.push(`${details.previousStatus} → ${details.status}`);
  if (details.description) parts.push(details.description);
  return parts.join(' · ');
}

function AuditActivity() {
  const { fetcher } = useApi();
  const audit = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => fetcher('/audit?limit=20&page=1'),
    refetchInterval: 30000,
  });

  const rows = audit.data?.data || [];

  return (
    <section className="officer-card audit-activity">
      <div className="card-heading audit-heading">
        <div>
          <span className="dashboard-eyebrow">SECURITY</span>
          <h2>Recent activity</h2>
          <p>Administrative and enforcement actions recorded by OTD.</p>
        </div>
        <span className="audit-live">Live</span>
      </div>

      {audit.isLoading && <p className="officer-muted">Loading activity...</p>}
      {audit.isError && <p className="officer-error" role="alert">{audit.error?.response?.data?.message || 'Unable to load audit activity.'}</p>}
      {!audit.isLoading && !audit.isError && rows.length === 0 && (
        <EmptyState title="No activity yet" description="Recorded administrative actions will appear here." />
      )}

      {rows.length > 0 && (
        <div className="audit-list">
          {rows.map((log) => {
            const detail = formatDetails(log);
            return (
              <article className="audit-item" key={log._id}>
                <div className="audit-marker" aria-hidden="true" />
                <div className="audit-content">
                  <div className="audit-topline">
                    <strong>{formatAction(log.action)}</strong>
                    <time dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleString()}</time>
                  </div>
                  <div className="audit-meta">
                    <span>{log.actorId?.name || 'Unknown actor'}</span>
                    {log.actorId?.role && <StatusBadge status={log.actorId.role}>{log.actorId.role}</StatusBadge>}
                    <span>{log.resourceType}</span>
                    {log.resourceId && <code>{String(log.resourceId).slice(-8)}</code>}
                  </div>
                  {detail && <p>{detail}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AuditActivity;
