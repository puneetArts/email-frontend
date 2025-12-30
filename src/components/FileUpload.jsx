import { useState } from "react";

export default function FileUpload({ onFileSelect }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-teal-400 rounded-xl p-8 text-center bg-white shadow-md hover:bg-teal-50 transition">
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-teal-600 font-semibold">Click to upload CSV</p>
        <p className="text-gray-500 text-sm mt-1">Only .csv files are supported</p>
      </label>
      {fileName && <p className="mt-4 text-gray-700 font-medium">📄 {fileName}</p>}
    </div>
  );
}
