import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);

      if (res.data.user.role === "driver") navigate('/driver');
      else if (res.data.user.role === "officer" || res.data.user.role === 'admin') navigate('/officer');
      else navigate('/');
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ paddingTop: '4rem' }}>
      <div className="card border-0 shadow-sm" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-4">
          <h1 className="h4 mb-3">Traffic Login</h1>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}

          <form onSubmit={submit}>
            <input
              className="otd-input"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              className="otd-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button
              className="btn btn-primary"
              disabled={loading}
              type="submit"
              style={{ width: '100%' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
