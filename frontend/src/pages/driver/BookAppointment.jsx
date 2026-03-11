import { useState } from "react";
import api from "../../api";

export default function BookAppointment() {
  const [type, setType] = useState("learner");
  const [date, setDate] = useState("");
  const [center, setCenter] = useState("");
  const [message, setMessage] = useState('');

  const book = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post("/appointments", { type, date, testingCenter: center });
      setMessage('Appointment booked successfully!');
      setDate('');
      setCenter('');
    } catch {
      setMessage('Failed to book appointment');
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">Book Appointment</h2>
        {message && <p>{message}</p>}

        <form onSubmit={book}>
          <select className="otd-input" value={type} onChange={e => setType(e.target.value)}>
            <option value="learner">Learner's Test</option>
            <option value="drivers">Driver's Test</option>
          </select>

          <input className="otd-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <input className="otd-input" placeholder="Testing Center" value={center} onChange={e => setCenter(e.target.value)} />
          <button type="submit" className="btn btn-primary">Book</button>
        </form>
      </div>
    </div>
  );
}
