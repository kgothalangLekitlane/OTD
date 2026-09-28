import { useContext, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', idNumber: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/register', {
        name: form.name.trim(),
        idNumber: form.idNumber.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      navigate('/login', { replace: true, state: { registered: true, from: location.state?.from } });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please check your details and try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card card border-0 shadow-lg">
        <div className="register-intro">
          <span className="register-badge">🚦 OTD</span>
          <h1>Create your OTD account</h1>
          <p>Register once to access online traffic services, appointments, licence information and fine management.</p>
          <ul>
            <li>Manage your traffic services online</li>
            <li>Book learner and driver test appointments</li>
            <li>View your licence and fine information</li>
          </ul>
        </div>
        <div className="register-form card-body">
          <h2 className="h3 fw-bold mb-1">Register</h2>
          <p className="text-muted mb-4">Enter your details to create an account.</p>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form onSubmit={submit} noValidate>
            <div className="mb-3"><label htmlFor="register-name" className="form-label fw-semibold">Full name</label><input id="register-name" name="name" className="form-control form-control-lg" value={form.name} onChange={update} autoComplete="name" placeholder="Your full name" minLength="2" maxLength="100" required /></div>
            <div className="mb-3"><label htmlFor="register-id" className="form-label fw-semibold">ID number</label><input id="register-id" name="idNumber" className="form-control form-control-lg" value={form.idNumber} onChange={update} autoComplete="off" placeholder="Enter your ID number" maxLength="50" required /></div>
            <div className="mb-3"><label htmlFor="register-email" className="form-label fw-semibold">Email address</label><input id="register-email" name="email" className="form-control form-control-lg" type="email" value={form.email} onChange={update} autoComplete="email" placeholder="you@example.com" required /></div>
            <div className="mb-3"><label htmlFor="register-password" className="form-label fw-semibold">Password</label><input id="register-password" name="password" className="form-control form-control-lg" type="password" value={form.password} onChange={update} autoComplete="new-password" placeholder="At least 8 characters" minLength="8" required /></div>
            <div className="mb-4"><label htmlFor="register-confirm-password" className="form-label fw-semibold">Confirm password</label><input id="register-confirm-password" name="confirmPassword" className="form-control form-control-lg" type="password" value={form.confirmPassword} onChange={update} autoComplete="new-password" placeholder="Re-enter your password" required /></div>
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
          </form>
          <p className="text-center text-muted mt-4 mb-0">Already have an account? <Link to="/login" className="fw-semibold">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
