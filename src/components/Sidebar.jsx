import { NavLink } from "react-router-dom";
import { Mail, Upload, Clock, Shield } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const { isAdmin } = useContext(AuthContext);

  const linkStyle =
    "flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-teal-100 rounded-md transition-all";

  const activeStyle =
    "bg-teal-500 text-white font-semibold hover:bg-teal-600";

  return (
    <aside className="fixed left-0 top-0 w-64 bg-white border border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 text-center">
        <img
          src={logo}
          alt="Globentix Verifier Logo"
          className="mx-auto w-32 h-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <Mail size={20} /> Single Verify
        </NavLink>

        <NavLink
          to="/bulk"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <Upload size={20} /> Bulk Upload
        </NavLink>

        <NavLink
          to="/recent"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <Clock size={20} /> Recent Lists
        </NavLink>

        {/* 🔒 ADMIN ONLY */}
        {isAdmin && (
          <NavLink
            to="/weekly"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : ""}`
            }
          >
            <Clock size={20} /> Weekly Good Emails
          </NavLink>
        )}

        <NavLink
          to="/catchall"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          <Shield size={20} /> Catch-All Check
        </NavLink>
      </nav>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-400 border-t">
        © 2025 Email Verifier
      </footer>
    </aside>
  );
}
