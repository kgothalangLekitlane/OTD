import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../components/Loading';
import './Appointments.css';

function Appointments() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    testingCenter: ''
  });
  const { request, fetcher } = useApi();
  const queryClient = useQueryClient();

  const { data: apptsResult = { data: [] }, isLoading, isError } = useQuery(
    ['myAppointments'],
    () => fetcher('/appointments/my'),
    { staleTime: 30_000 }
  );
  const appointments = apptsResult.data || [];

  const createMutation = useMutation(
    (newAppt) => request('POST', '/appointments', newAppt),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myAppointments']);
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setFormData({ date: '', time: '', type: '' });
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
                <option value="learner">Learner's Permit Test</option>
                <option value="drivers">Driver's Test</option>
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

            <div className="form-group">
              <label>Testing Center</label>
              <input
                type="text"
                name="testingCenter"
                value={formData.testingCenter || ''}
                onChange={handleChange}
                placeholder="Enter testing center"
              />
            </div>

            <button type="submit" className="submit-btn">Book</button>
          </form>
        </div>

        <div className="appointments-list">
          <h2>Your Appointments</h2>
          {isError && <div className="error-message">Failed to load appointments</div>}
          {isLoading && <Loading />}
          {!isLoading && appointments.length === 0 && (
            <p className="no-data">No appointments scheduled</p>
          )}
          {appointments.map(appointment => (
            <div key={appointment.id || appointment._id} className="appointment-item">
              <h3>{appointment.type}</h3>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              {appointment.testingCenter && (
                <p><strong>Center:</strong> {appointment.testingCenter}</p>
              )}
              <p><strong>Status:</strong> {appointment.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
