// src/pages/SingleEmail.jsx
import { useState } from "react";
import EmailInput from "../components/EmailInput";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function SingleEmail() {
  const [result, setResult] = useState(null);

  // This function will receive the response from EmailInput
  const handleResult = (res) => {
    console.log("Verification Result:", res);
    setResult(res);
  };

  return (
   <div className="space-y-10 p-6">
    <h1 className="text-5xl font-bold mb-4 text-teal-600 text-center">Single Email Verification</h1>
     <div className="max-w-auto mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 ">Enter Email Address</h2>

      {/* ✅ Pass handleResult as onResult */}
      <EmailInput onResult={handleResult} />

      {result && (
  <div
    className={`mt-6 p-4 border rounded-lg shadow-sm ${
      result.status === "Good"
        ? "bg-green-100 border-green-300"
        : result.status === "Risky"
        ? "bg-yellow-100 border-yellow-300"
        : result.status === "Bad"
        ? "bg-red-200 border-red-300"
        : "bg-gray-100 border-gray-300"
    }`}
  >
    <h2 className="text-lg font-semibold mb-2">Verification Result:</h2>

    <p><strong>Status:</strong> {result.status ? result.status : "N/A"}</p>
    {/* <p><strong>Domain:</strong> {result.domain ? result.domain : "N/A"}</p> */}
   {/* <p><strong>Disposable:</strong> {result.is_disposable ? "Yes" : "No"}</p> */}
   {/* <p><strong>MX Found:</strong> {result.mx_found ? "Yes" : "No"}</p> */}
    {/* <p><strong>Catch All:</strong> {result.catch_all ? "Yes" : "No"}</p> */}
  </div>
)}

   

    </div>
    {/* Info Section: Types of Categories */}
      <section className="max-w-auto mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Types of Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* ✅ Good */}
          <div className="flex flex-col items-start gap-3 p-5 border rounded-xl bg-green-50 border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Good</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Emails that are valid and safe to send to. These addresses have valid MX
              records and belong to trusted providers.
            </p>
          </div>

          {/* ⚠️ Risky */}
          <div className="flex flex-col items-start gap-3 p-5 border rounded-xl bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Risky</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Unknown or catch-all domains. These may exist but are not guaranteed to
              reach a real inbox — send at your own risk.
            </p>
          </div>

          {/* ❌ Bad */}
          <div className="flex flex-col items-start gap-3 p-5 border rounded-xl bg-red-50 border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Bad</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Invalid or disposable addresses that should not be used for sending
              emails. These usually fail MX checks or belong to temporary mail services.
            </p>
          </div>
        </div>
      </section>
   </div>
  );
}
