import './FineCard.css';

function FineCard({ fine }) {
  return (
    <div className="fine-card">
      <div className="fine-card-header">
        <h3>Fine #{fine.id}</h3>
        <span className={`status ${fine.status.toLowerCase()}`}>
          {fine.status}
        </span>
      </div>
      <div className="fine-card-body">
        <p><strong>License:</strong> {fine.license}</p>
        <p><strong>Amount:</strong> ${fine.amount}</p>
        <p><strong>Date:</strong> {new Date(fine.date).toLocaleDateString()}</p>
        <p><strong>Description:</strong> {fine.description}</p>
      </div>
    </div>
  );
}

export default FineCard;
