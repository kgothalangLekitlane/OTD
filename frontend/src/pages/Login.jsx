import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/login', { email: normalizedEmail, password });
      login(res.data);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card border-0 shadow-sm rounded-4 login-card">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="login-icon" aria-hidden="true">🚦</div>
            <h1 className="h2 fw-bold mb-2">Welcome back</h1>
            <p className="text-muted mb-0">Sign in to manage your OTD services.</p>
          </div>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <form onSubmit={submit} noValidate>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label fw-semibold">Email</label>
              <input id="login-email" className="form-control form-control-lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" required />
            </div>
            <div className="mb-4">
              <label htmlFor="login-password" className="form-label fw-semibold">Password</label>
              <input id="login-password" className="form-control form-control-lg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
