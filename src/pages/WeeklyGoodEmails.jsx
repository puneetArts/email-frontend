// frontend/src/pages/WeeklyGoodEmails.jsx
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

export default function WeeklyGoodEmails() {
  const { isAdmin, token } = useContext(AuthContext);

  const [emails, setEmails] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const VITE_API_BASE = import.meta.env.VITE_API_BASE; // ✅ Use env variable

  // 🚫 Block normal users at UI level
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE}/api/email/weekly-good`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Unauthorized or forbidden");
        }

        const data = await res.json();
        setEmails(data.emails || []);

        // Default week = latest week
        if (data.emails && data.emails.length > 0) {
          const weeks = [
            ...new Set(data.emails.map((e) => e.week_start)),
          ].sort();
          setSelectedWeek(weeks[weeks.length - 1]);
        }
      } catch (err) {
        console.error(err);
        setError("You are not authorized to view this data.");
      }
    };

    fetchEmails();
  }, [token, VITE_API_BASE]);

  // --- FILTER EMAILS BY SELECTED WEEK ---
  const filteredEmails = emails.filter(
    (e) =>
      e.week_start === selectedWeek &&
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  // --- GET UNIQUE WEEKS FOR DROPDOWN ---
  const weeks = [...new Set(emails.map((e) => e.week_start))].sort();

  // --- WEEKLY EMAIL COUNTS FOR GRAPH ---
  const weeklyCounts = weeks.map((week) => ({
    week: new Date(week).toLocaleDateString(),
    count: emails.filter((e) => e.week_start === week).length,
  }));

  // --- CSV DOWNLOAD FOR SELECTED WEEK ---
  const downloadCSV = () => {
    if (filteredEmails.length === 0) return;

    const header = "email,week_start\n";

    const rows = filteredEmails
      .map((e) => {
        const d = new Date(e.week_start);
        const formatted =
          String(d.getDate()).padStart(2, "0") +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0") +
          "-" +
          d.getFullYear();

        return `${e.email},"${formatted}"`;
      })
      .join("\n");

    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `weekly_emails_${selectedWeek}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-6 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ---------------------- Page Title ---------------------- */}
      <h2 className="text-3xl font-bold text-teal-600">
        Weekly Good Emails
      </h2>

      {/* ---------------------- Controls Section ---------------------- */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Week Filter */}
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {weeks.map((w, i) => (
            <option key={i} value={w}>
              {new Date(w).toLocaleDateString()}
            </option>
          ))}
        </select>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search email..."
          className="p-2 border rounded-lg flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CSV Download */}
        <button
          onClick={downloadCSV}
          disabled={filteredEmails.length === 0} // ✅ disable if no data
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md text-white ${
            filteredEmails.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          <Download className="w-5 h-5" />
          Export selected week's emails
        </button>
      </div>

      {/* ---------------------- Email List ---------------------- */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        {filteredEmails.length === 0 ? (
          <p className="text-gray-400">No emails for this week.</p>
        ) : (
          filteredEmails.map((e, i) => (
            <div
              key={i}
              className="border-b border-gray-200 last:border-b-0 py-2 flex justify-between text-gray-700"
            >
              <span>{e.email}</span>
              <span className="text-gray-400 text-sm">
                {new Date(e.week_start).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ---------------------- Weekly Line Graph ---------------------- */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Weekly Growth</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#14b8a6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
