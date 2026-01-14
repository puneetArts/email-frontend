// frontend/pages/Profile.js
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // UI-only subscription state
  const [subscription] = useState({
    status: "Not Subscribed",
  });

  const VITE_API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${VITE_API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setName(res.data.name || "");
      } catch {
        setMsg({ type: "error", text: "Failed to load profile" });
      }
    };

    fetchProfile();
  }, [token, VITE_API_BASE]);

  const handleUpdate = async () => {
    setLoading(true);
    setMsg(null);

    try {
      await axios.put(
        `${VITE_API_BASE}/api/profile`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser({ ...user, name });
      setIsEditing(false);
      setMsg({ type: "success", text: "Profile updated successfully" });
    } catch {
      setMsg({ type: "error", text: "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-teal-600">
          My Profile
        </h2>

        {/* ✅ Logout ONLY here */}
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {msg && (
        <div
          className={`p-3 rounded ${
            msg.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Profile Info */}
      <div className="relative p-6 border border-gray-300 rounded-md bg-white">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 text-sm text-teal-600 hover:underline"
          >
            Edit
          </button>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Name</p>
            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-400"
              />
            ) : (
              <p className="text-lg">{user.name || "—"}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="py-2 px-4 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name || "");
                }}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subscription (UI only) */}
      <div className="p-6 border border-gray-300 rounded-md bg-white space-y-4">
        <h3 className="text-2xl font-semibold text-teal-600">
          Subscription
        </h3>
        <p className="text-gray-600">
          Manage your subscription details
        </p>
        <p className="text-gray-800">
          You are currently:{" "}
          <span className="font-medium">{subscription.status}</span>
        </p>

        <button
          className="py-2 px-4 bg-teal-500 text-white rounded cursor-not-allowed opacity-60"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
}
