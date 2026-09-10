import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import './Appointments.css';

const initialForm = { date: '', time: '', type: '', testingCenter: '' };

function Appointments() {
  const [formData, setFormData] = useState(initialForm);
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
    { onSuccess: () => queryClient.invalidateQueries(['myAppointments']) }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setFormData(initialForm);
    } catch (err) {
      // The mutation error is rendered below so the user gets actionable feedback.
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="appointments">
      <h1>Appointments</h1>

      <div className="appointments-container">
        <div className="book-appointment">
          <h2>Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="appointment-type">Type</label>
              <select id="appointment-type" name="type" value={formData.type} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="learner">Learner's Permit Test</option>
                <option value="drivers">Driver's Test</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appointment-date">Date</label>
              <input id="appointment-date" type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
            </div>

            <div className="form-group">
              <label htmlFor="appointment-time">Time</label>
              <input id="appointment-time" type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="testing-center">Testing Center</label>
              <input id="testing-center" type="text" name="testingCenter" value={formData.testingCenter} onChange={handleChange} placeholder="Enter testing center" />
            </div>

            {createMutation.isError && (
              <div className="error-message" role="alert">
                {createMutation.error?.message || 'Unable to book this appointment. Please check the details and try again.'}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>

        <div className="appointments-list">
          <h2>Your Appointments</h2>
          {isError && <div className="error-message" role="alert">Failed to load appointments. Please refresh and try again.</div>}
          {isLoading && <Loading />}
          {!isLoading && !isError && appointments.length === 0 && (
            <EmptyState title="No appointments yet" message="Your booked learner and driver tests will appear here." />
          )}
          {!isLoading && appointments.map(appointment => (
            <div key={appointment.id || appointment._id} className="appointment-item">
              <h3>{appointment.type}</h3>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              {appointment.testingCenter && <p><strong>Center:</strong> {appointment.testingCenter}</p>}
              <p><strong>Status:</strong> <StatusBadge status={appointment.status} /></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
