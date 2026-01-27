import { useState } from "react";
import api from "../../api";

export default function LicenseLookup() {
  const [idNumber, setIdNumber] = useState("");
  const [data, setData] = useState(null);

  const search = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/license/lookup/${idNumber}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setData(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">License Lookup</h2>

      <input
        className="border p-2 mb-3"
        placeholder="Enter ID Number"
        onChange={e => setIdNumber(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={search}
      >
        Search
      </button>

      {data && (
        <pre className="bg-gray-100 p-4 mt-4 rounded shadow">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
