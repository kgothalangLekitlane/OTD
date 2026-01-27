import { useState } from "react";
import api from "../../api";

export default function IssueFine() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const issue = async () => {
    const token = localStorage.getItem("token");

    await api.post(
      "/fines/issue",
      { userId, amount, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Fine issued successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Issue Fine</h2>

      <input
        className="border p-2 mb-3 block"
        placeholder="Driver User ID"
        onChange={e => setUserId(e.target.value)}
      />

      <input
        className="border p-2 mb-3 block"
        type="number"
        placeholder="Amount (R)"
        onChange={e => setAmount(e.target.value)}
      />

      <textarea
        className="border p-2 mb-3 block"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />

      <button
        onClick={issue}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Issue Fine
      </button>
    </div>
  );
}
