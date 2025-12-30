// frontend/src/components/BulkUpload.jsx
import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import * as XLSX from "xlsx";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [emails, setEmails] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadFilter, setDownloadFilter] = useState("All");

  const VITE_API_BASE = import.meta.env.VITE_API_BASE; // ✅ Correct env usage

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    // ✅ File size check (max 5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setFile(uploadedFile);
    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(uploadedFile, {
        header: false,
        skipEmptyLines: true,
        complete: function (results) {
          const emailsParsed = results.data.map((row) => row[0]);
          setEmails(emailsParsed);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "array" }); // ✅ use array
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const extractedEmails = jsonData
          .flat()
          .filter((val) => typeof val === "string" && val.includes("@"));
        setEmails(extractedEmails);
      };
      reader.readAsArrayBuffer(uploadedFile); // ✅ updated
    } else {
      alert("Please upload a valid CSV or Excel file.");
    }
  };

  // 🚀 FAST BULK VERIFICATION USING BATCHING
  const verifyAll = async () => {
    if (emails.length === 0) return;

    setLoading(true);

    const BATCH_SIZE = 20; 
    const verified = [];

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (email) => {
          try {
            const res = await axios.post(`${VITE_API_BASE}/api/email/verify`, { email });
            return { email, status: res.data.status, reason: res.data.reason };
          } catch {
            return { email, status: "Error", reason: "Server not reachable" };
          }
        })
      );

      verified.push(...batchResults);
    }

    setResults(verified);
    saveToHistory(verified);
    setLoading(false);
  };

  const saveToHistory = (verified) => {
    const newList = {
      id: Date.now(),
      name: file
        ? file.name
        : `Bulk_${new Date().toISOString().split("T")[0]}.csv`,
      date: new Date().toLocaleDateString(),
      verified: verified.length,
      good: verified.filter((r) => r.status === "Good").length,
      risky: verified.filter((r) => r.status === "Risky").length,
      bad: verified.filter((r) => r.status === "Bad").length,
      results: verified,
    };

    const existing = JSON.parse(localStorage.getItem("emailLists") || "[]");
    existing.unshift(newList);
    localStorage.setItem("emailLists", JSON.stringify(existing));
  };

  const downloadCSV = () => {
    let filteredResults = results;
    if (downloadFilter !== "All")
      filteredResults = results.filter((r) => r.status === downloadFilter);

    const csvRows = [["Email", "Status", "Reason"], ...filteredResults.map((r) => [r.email, r.status, r.reason])];
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split("T")[0];

    // ✅ Corrected file name for CSV & Excel
    const baseName = file ? file.name.replace(/\.(csv|xlsx|xls)/i, "") : `verified_results_${date}`;
    const fileName =
      downloadFilter === "All"
        ? `${baseName}_results_${date}.csv`
        : `${downloadFilter.toLowerCase()}_results_${date}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalGood = results.filter((r) => r.status === "Good").length;
  const totalRisky = results.filter((r) => r.status === "Risky").length;
  const totalBad = results.filter((r) => r.status === "Bad").length;

  return (
    <div className="p-6">
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white px-10 py-8 rounded-xl shadow-xl text-center space-y-3">
            <h2 className="text-3xl font-bold text-teal-600">Validating...</h2>
            <p className="text-gray-600 text-sm">Do not close or refresh this tab</p>
            <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent mx-auto rounded-full" />
          </div>
        </div>
      )}

      <h2 className="text-5xl font-bold mb-6 text-teal-600 text-center">Bulk Email Verification</h2>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 ">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload CSV or Excel File</h2>
        <label
          htmlFor="fileUpload"
          className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-teal-400 rounded-xl cursor-pointer bg-teal-50 hover:bg-teal-100 transition-all"
        >
          <div className="flex flex-col items-center justify-center pt-4 pb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-2 text-teal-500" fill="none" viewBox="0 0 24 24"
              strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV or Excel file (max 5MB)</p>
          </div>
          <input
            id="fileUpload"
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg text-center">
            <p className="text-gray-700 text-sm">
              <strong>{file.name}</strong> uploaded ({emails.length} emails found)
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={verifyAll}
            disabled={loading || emails.length === 0}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              loading ? "bg-teal-300 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {loading ? "Verifying..." : "Start Verification"}
          </button>
        </div>
      </div>

      {/* SUMMARY BOXES */}
      {results.length > 0 && (
        <div className="mt-10 space-y-8">
          <div className="flex flex-wrap justify-center items-center gap-5">

            {/* Good */}
            <div className="px-6 py-4 bg-white border border-green-200 rounded-xl w-89 h-34 flex justify-between items-center">
              <div className="flex flex-col items-start">
                <p className="text-2xl text-black">Good</p>
                <p className="text-4xl font-extrabold text-green-600">{totalGood}</p>
              </div>
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={totalGood}
                  maxValue={results.length}
                  text={`${results.length ? Math.round((totalGood / results.length) * 100) : 0}%`}
                  styles={buildStyles({
                    pathColor: "#22c55e",
                    textColor: "#166534",
                    trailColor: "#d1fae5",
                  })}
                />
              </div>
            </div>

            {/* Risky */}
            <div className="px-6 py-4 bg-white border border-yellow-200 rounded-xl w-89 h-34 flex justify-between items-center">
              <div className="flex flex-col items-start">
                <p className="text-2xl text-black">Risky</p>
                <p className="text-4xl font-extrabold text-yellow-600">{totalRisky}</p>
              </div>
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={totalRisky}
                  maxValue={results.length}
                  text={`${results.length ? Math.round((totalRisky / results.length) * 100) : 0}%`}
                  styles={buildStyles({
                    pathColor: "#eab308",
                    textColor: "#854d0e",
                    trailColor: "#fef9c3",
                  })}
                />
              </div>
            </div>

            {/* Bad */}
            <div className="px-6 py-4 bg-white border border-red-200 rounded-xl w-89 h-34 flex justify-between items-center">
              <div className="flex flex-col items-start">
                <p className="text-2xl text-black">Bad</p>
                <p className="text-4xl font-extrabold text-red-600">{totalBad}</p>
              </div>
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={totalBad}
                  maxValue={results.length}
                  text={`${results.length ? Math.round((totalBad / results.length) * 100) : 0}%`}
                  styles={buildStyles({
                    pathColor: "#ef4444",
                    textColor: "#7f1d1d",
                    trailColor: "#fee2e2",
                  })}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Download Section */}
      {results.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-7">
          <div className="relative w-full max-w-xs">
            <select
              value={downloadFilter}
              onChange={(e) => setDownloadFilter(e.target.value)}
              className="w-full px-5 py-3 bg-white border border-teal-200 rounded-xl shadow-sm text-gray-700 font-medium 
              focus:outline-none focus:ring-2 focus:ring-teal-500 hover:shadow-md transition-all cursor-pointer appearance-none"
            >
              <option value="All">All Results</option>
              <option value="Good">Good Only</option>
              <option value="Risky">Risky Only</option>
              <option value="Bad">Bad Only</option>
            </select>

            <svg xmlns="http://www.w3.org/2000/svg"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button
            onClick={downloadCSV}
            className="px-6 py-3 bg-black hover:bg-teal-600 text-white font-semibold rounded-lg transition"
          >
            Download CSV
          </button>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Results</h3>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="bg-teal-100">
                <tr>
                  <th className="px-4 py-2 font-semibold">Email</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{r.email}</td>
                    <td className={`px-4 py-2 font-semibold ${
                        r.status === "Good"
                          ? "text-green-600"
                          : r.status === "Risky"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {r.status}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="mt-10 bg-teal-50 p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-teal-700 mb-6 text-center">How to Use</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-600 font-bold rounded-full mb-3">1</div>
            <h3 className="font-semibold mb-1">Upload</h3>
            <p className="text-sm text-gray-600">Upload a CSV with the email addresses that you want to verify.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-600 font-bold rounded-full mb-3">2</div>
            <h3 className="font-semibold mb-1">Verify</h3>
            <p className="text-sm text-gray-600">We’ll do all the hard work and verify if each email exists or not.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-600 font-bold rounded-full mb-3">3</div>
            <h3 className="font-semibold mb-1">Download</h3>
            <p className="text-sm text-gray-600">
              Download a CSV instantly categorizing emails as Good, Risky, or Bad — or filter only the ones you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
