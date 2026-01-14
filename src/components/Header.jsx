// frontend/src/components/Header.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-64 w-[calc(100%-16rem)] z-50 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold text-black">
        Globentix{" "}
        <span className="text-xl font-bold text-teal-600">
          Email-Verifier
        </span>
      </h2>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="text-sm text-gray-700">
            Signed in as{" "}
            <span className="font-semibold">{user.email}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm text-gray-700 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm text-teal-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
