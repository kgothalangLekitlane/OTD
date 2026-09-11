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

  const appointmentsQuery = useQuery({
    queryKey: ['myAppointments'],
    queryFn: () => fetcher('/appointments/my'),
    staleTime: 30_000,
  });
  const appointments = appointmentsQuery.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (newAppt) => request('POST', '/appointments', newAppt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'appointments'] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        testingCenter: formData.testingCenter.trim(),
      });
      setFormData(initialForm);
    } catch {
      // Error feedback is rendered below.
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="appointments">
      <div className="page-heading">
        <div>
          <span className="dashboard-eyebrow">OTD SERVICES</span>
          <h1>Appointments</h1>
          <p>Book and keep track of your learner or driver testing appointment.</p>
        </div>
      </div>

      <div className="appointments-container">
        <div className="book-appointment">
          <h2>Book an Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="appointment-type">Test type</label>
              <select id="appointment-type" name="type" value={formData.type} onChange={handleChange} required>
                <option value="">Select test type</option>
                <option value="learner">Learner's Permit Test</option>
                <option value="drivers">Driver's Test</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appointment-date">Date</label>
              <input id="appointment-date" type="date" name="date" value={formData.date} onChange={handleChange} min={today} required />
            </div>

            <div className="form-group">
              <label htmlFor="appointment-time">Time</label>
              <input id="appointment-time" type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="testing-center">Testing centre <span className="text-muted">(optional)</span></label>
              <input id="testing-center" type="text" name="testingCenter" value={formData.testingCenter} onChange={handleChange} maxLength={160} placeholder="e.g. Mbombela Testing Centre" />
            </div>

            {createMutation.isError && (
              <div className="error-message" role="alert">
                {createMutation.error?.response?.data?.message || createMutation.error?.message || 'Unable to book this appointment. Please check the details and try again.'}
              </div>
            )}
            {createMutation.isSuccess && <div className="success-message" role="status">Appointment booked successfully.</div>}

            <button type="submit" className="submit-btn" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>

        <div className="appointments-list">
          <div className="list-heading">
            <div><h2>Your Appointments</h2><p>{appointments.length} appointment{appointments.length === 1 ? '' : 's'} on record.</p></div>
          </div>
          {appointmentsQuery.isError && <div className="error-message" role="alert">{appointmentsQuery.error?.response?.data?.message || 'Failed to load appointments. Please refresh and try again.'}</div>}
          {appointmentsQuery.isLoading && <Loading />}
          {!appointmentsQuery.isLoading && !appointmentsQuery.isError && appointments.length === 0 && (
            <EmptyState title="No appointments yet" message="Your booked learner and driver tests will appear here." />
          )}
          {!appointmentsQuery.isLoading && appointments.map(appointment => (
            <div key={appointment.id || appointment._id} className="appointment-item">
              <div className="appointment-item-header">
                <h3>{appointment.type === 'drivers' ? "Driver's Test" : "Learner's Permit Test"}</h3>
                <StatusBadge status={appointment.status}>{appointment.status || 'Unknown'}</StatusBadge>
              </div>
              <p><strong>Date:</strong> {appointment.date ? new Date(appointment.date).toLocaleDateString() : '—'}</p>
              <p><strong>Time:</strong> {appointment.time || '—'}</p>
              {appointment.testingCenter && <p><strong>Centre:</strong> {appointment.testingCenter}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
