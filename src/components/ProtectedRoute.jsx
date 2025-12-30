// ProtectedRoute.jsx
import { useContext, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const toastShown = useRef(false); // 🔒 prevents repeat toasts

  useEffect(() => {
    if (!user && !toastShown.current) {
      toast.error("Please log in to access this feature.");
      toastShown.current = true;
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
