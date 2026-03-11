import { useState } from "react";
import api from "../../api";

export default function IssueFine() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState('');

  const issue = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post("/fines/issue", { userId, amount: Number(amount), description });
      setMessage('Fine issued successfully!');
      setUserId('');
      setAmount('');
      setDescription('');
    } catch {
      setMessage('Failed to issue fine');
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">Issue Fine</h2>
        {message && <p>{message}</p>}

        <form onSubmit={issue}>
          <input className="otd-input" placeholder="Driver User ID" value={userId} onChange={e => setUserId(e.target.value)} required />
          <input className="otd-input" type="number" min="1" placeholder="Amount (R)" value={amount} onChange={e => setAmount(e.target.value)} required />
          <textarea className="otd-input" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <button type="submit" className="btn btn-primary">Issue Fine</button>
        </form>
      </div>
    </div>
  );
}
