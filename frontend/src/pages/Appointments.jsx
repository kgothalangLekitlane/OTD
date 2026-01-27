import { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import Loading from '../components/Loading';
import './Appointments.css';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: ''
  });
  const { request, loading, error } = useApi();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await request('GET', '/appointments');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await request('POST', '/appointments', formData);
      setFormData({ date: '', time: '', type: '' });
      fetchAppointments();
    } catch (err) {
      console.error('Failed to create appointment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="appointments">
      <h1>Appointments</h1>

      <div className="appointments-container">
        <div className="book-appointment">
          <h2>Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="renewal">License Renewal</option>
                <option value="test">Driving Test</option>
                <option value="inspection">Vehicle Inspection</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Book</button>
          </form>
        </div>

        <div className="appointments-list">
          <h2>Your Appointments</h2>
          {error && <div className="error-message">{error}</div>}
          {loading && <Loading />}
          {appointments.length === 0 && !loading && (
            <p className="no-data">No appointments scheduled</p>
          )}
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-item">
              <h3>{appointment.type}</h3>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
