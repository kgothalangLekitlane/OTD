import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);

      if (res.data.user.role === "driver") window.location.href = "/driver";
      else if (res.data.user.role === "officer") window.location.href = "/officer";
      else window.location.href = "/";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center mt-40">
      <h1 className="text-3xl font-bold mb-6">Traffic Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        className="border p-2 w-80 mb-3"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-80 mb-3"
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={submit}
      >
        Login
      </button>
    </div>
  );
}
