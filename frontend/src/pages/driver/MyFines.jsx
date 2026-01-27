import { useState, useEffect } from "react";
import api from "../../api";

export default function MyFines() {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/fines/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFines(res.data);
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Fines</h2>

      {fines.length === 0 && <p>No fines found.</p>}

      {fines.map(f => (
        <div key={f._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <p><strong>Description:</strong> {f.description}</p>
          <p><strong>Amount:</strong> R{f.amount}</p>
          <p><strong>Status:</strong> {f.status}</p>
        </div>
      ))}
    </div>
  );
}
