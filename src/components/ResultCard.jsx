export default function ResultCard({ result }) {
  if (!result) return null;

  const colorMap = {
    Good: "bg-green-100 text-green-800 border-green-400",
    Risky: "bg-yellow-100 text-yellow-800 border-yellow-400",
    Bad: "bg-red-100 text-red-800 border-red-400",
    Error: "bg-gray-100 text-gray-800 border-gray-400",
  };

  return (
    <div className={`mt-6 p-6 border-l-4 rounded-lg ${colorMap[result.status] || colorMap.Error}`}>
      <p className="text-xl font-semibold">Status: {result.status}</p>
      <p className="text-sm mt-2">Reason: {result.reason}</p>
    </div>
  );
}
