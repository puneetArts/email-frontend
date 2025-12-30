// src/components/EmailInput.jsx
import { useState } from "react";

export default function EmailInput({ onResult }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const VITE_API_BASE = import.meta.env.VITE_API_BASE; // ✅ use environment variable

  const verifyEmail = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`${VITE_API_BASE}/api/email/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (typeof onResult === "function") {
        onResult(data);
      } else {
        console.error("onResult is not a function");
      }
    } catch (error) {
      if (typeof onResult === "function") {
        onResult({ status: "Error", reason: "Server not reachable" });
      } else {
        console.error("onResult is not a function");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@example.com"
        className="border border-gray-300 p-2 flex-1 rounded"
      />
      <button
        onClick={verifyEmail}
        disabled={loading || !email}
        className={`px-4 py-2 rounded text-white transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-700"
        }`}
      >
        {loading ? "Validating..." : "Validate"}
      </button>
    </div>
  );
}
