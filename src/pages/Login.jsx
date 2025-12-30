// frontend/src/pages/Login.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import illus from "../assets/illus2.png"; // ✅ Import local image
import './Login.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const VITE_API_BASE = import.meta.env.VITE_API_BASE; // ✅ Use env variable

    console.log("API BASE =", import.meta.env.VITE_API_BASE);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await axios.post(`${VITE_API_BASE}/api/auth/login`, {
        email,
        password,
      });

      login({ user: res.data.user, token: res.data.token });
      setMsg({ type: "success", text: "Logged in successfully! Redirecting..." });

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const text = err?.response?.data?.message || "Login failed. Please try again.";
      setMsg({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <div className="flex bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full">
        {/* LEFT: Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold mb-6 text-teal-600 text-center">
            Welcome Back
          </h2>

          {msg && (
            <div
              className={`p-3 rounded mb-4 text-center ${
                msg.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !email || !password} // ✅ disable if fields empty
              className="w-full py-2 rounded bg-teal-500 text-white font-medium hover:bg-teal-600 transition duration-200 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-teal-600 font-medium hover:underline"
            >
              Sign up here
            </a>
          </p>
        </div>

        {/* RIGHT: Illustration */}
        <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
          <img
            src={illus}
            alt="Login illustration"
          />
        </div>
      </div>
    </div>
  );
}
