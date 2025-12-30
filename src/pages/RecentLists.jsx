//frontend/src/pages/RecentList.jsx  
import { useEffect, useState } from "react";

export default function RecentLists() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("emailLists") || "[]");
    setLists(stored);
  }, []);

  const downloadCSV = (results, fileName) => {
    const csvRows = [
      ["Email", "Status", "Reason"],
      ...results.map((r) => [r.email, r.status, r.reason]),
    ];

    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 bg-gray-50 ">
      <h2 className="flex items-center text-3xl font-bold text-teal-600 mb-8">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 mr-3 text-teal-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v16h16V4H4zm4 4h8v8H8V8z"
          />
        </svg> */}
        Recent Verification Lists
      </h2>

      {lists.length === 0 ? (
        <p className="text-gray-600">No verification history found yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-teal-700">{list.name}</h3>
                <span className="text-sm text-gray-500">{list.date}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700 mb-3">
                <p>Total: {list.verified}</p>
                <p className="text-green-600">Good: {list.good}</p>
                <p className="text-yellow-600">Risky: {list.risky}</p>
                <p className="text-red-600">Bad: {list.bad}</p>
              </div>

              <button
                onClick={() => downloadCSV(list.results, list.name)}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition"
              >
                Download Results
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
