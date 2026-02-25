import './FineCard.css';

function FineCard({ fine }) {
  const id = fine._id || fine.id || '—';
  const status = fine.status || 'unknown';
  const amount = fine.amount != null ? fine.amount : '—';
  const date = fine.issuedDate || fine.date || fine.createdAt;

  return (
    <div className="fine-card">
      <div className="fine-card-header">
        <h3>Fine #{id}</h3>
        <span className={`status ${String(status).toLowerCase()}`}>
          {status}
        </span>
      </div>
      <div className="fine-card-body">
        <p><strong>License/User:</strong> {fine.license || fine.userId || 'N/A'}</p>
        <p><strong>Amount:</strong> R{amount}</p>
        <p><strong>Date:</strong> {date ? new Date(date).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Description:</strong> {fine.description || '—'}</p>
      </div>
    </div>
  );
}

export default FineCard;
