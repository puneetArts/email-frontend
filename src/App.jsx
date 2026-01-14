// frontend/src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SingleEmail from "./pages/SingleEmail";
import BulkUpload from "./pages/BulkUpload";
import RecentLists from "./pages/RecentLists";
import CatchAll from "./pages/CatchAll";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import WeeklyGoodEmails from "./pages/WeeklyGoodEmails";
import Profile from "./pages/Profile";



function AppContent() {
  const location = useLocation();

  // Hide layout on login/signup pages
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideLayout && <Sidebar />}
      <div
        className={`flex-1 flex flex-col overflow-y-auto ${
          !hideLayout ? "ml-64" : ""
        }`}
      >
        {!hideLayout && <Header />}
        {/* ✅ Apply top margin only when header is visible */}
        <main className={`flex-1 ${!hideLayout ? "mt-20" : ""}`}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SingleEmail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bulk"
              element={
                <ProtectedRoute>
                  <BulkUpload />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/recent"
              element={
                <ProtectedRoute>
                  <RecentLists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catchall"
              element={
                <ProtectedRoute>
                  <CatchAll />
                </ProtectedRoute>
              }
            />
            <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

          <Route
  path="/weekly"
  element={
    <ProtectedRoute>
      <WeeklyGoodEmails />
    </ProtectedRoute>
  }
/>


            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <AppContent />
    </Router>
  );
}
