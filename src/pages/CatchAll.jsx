import { useState } from "react";
import { Rocket } from "lucide-react";

export default function CatchAll() {
  const [isApplied, setIsApplied] = useState(false);
  const [plan, setPlan] = useState("free"); // could come from backend

  const handleApply = () => {
    if (plan === "pro") {
      setIsApplied(true);
      alert("✅ Catch-All Verification activated for your account!");
    } else {
      alert("Upgrade to Pro to use Catch-All Verification!");
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center mb-2">
          <Rocket className="w-6 h-6 text-teal-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Catch All Verification
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          Validate risky emails with <span className="font-medium">99% accuracy</span>
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          In standard email verification, many emails get labeled as Risky, Catch-All, or
          Unknown, leaving a significant portion of your leads in limbo. Traditional tools
          often struggle with these, meaning you could miss out on valuable opportunities
          that are difficult to validate. So, we built a tool to validate risky emails with
          99% accuracy.
        </p>

        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Why you should be interested?
        </h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
          <li>
            These "risky" emails often belong to prospects who are less targeted, making them
            more likely to engage. This gives you a unique opportunity to connect where others
            haven’t.
          </li>
          <li>
            In niche markets, every contact counts. Catch-All Verification helps you maximize
            your reach by validating those hard-to-confirm addresses, ensuring no opportunity
            is missed.
          </li>
        </ul>

        {/* Dynamic Button */}
        <div className="w-full">
          <button
            onClick={handleApply}
            disabled={isApplied}
            className={`w-full py-3 font-semibold rounded-lg transition-all ${
              isApplied
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 text-white"
            }`}
          >
            {isApplied ? "Applied" : plan === "pro" ? "Apply" : "Upgrade to Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
