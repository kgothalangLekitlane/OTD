import { useState } from "react";
import api from "../../api";

export default function BookAppointment() {
  const [type, setType] = useState("learner");
  const [date, setDate] = useState("");
  const [center, setCenter] = useState("");

  const book = async () => {
    const token = localStorage.getItem("token");

    await api.post(
      "/appointments",
      { type, date, testingCenter: center },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Appointment booked successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

      <select
        className="border p-2 mb-3"
        onChange={e => setType(e.target.value)}
      >
        <option value="learner">Learner's Test</option>
        <option value="drivers">Driver's Test</option>
      </select>

      <input
        className="border p-2 mb-3 block"
        type="date"
        onChange={e => setDate(e.target.value)}
      />

      <input
        className="border p-2 mb-3 block"
        placeholder="Testing Center"
        onChange={e => setCenter(e.target.value)}
      />

      <button
        onClick={book}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Book
      </button>
    </div>
  );
}
