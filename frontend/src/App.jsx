import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ATSResult from "./pages/ATSResult";
import JobMatch from "./pages/JobMatch";
import AISuggestions from "./pages/AISuggestions";
import InterviewPrep from "./pages/InterviewPrep";
import History from "./pages/History";
import PrivacySettings from "./pages/PrivacySettings";

const publicRoutes = ["/", "/login", "/register"];

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0b1120] lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28rem),radial-gradient(circle_at_70%_0%,rgba(139,92,246,0.10),transparent_28rem)]">
        <Navbar onMenu={() => setSidebarOpen(true)} />
        {children}
      </div>
    </div>
  );
};

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("latestAnalysis");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("latestAnalysis");
    return false;
  }
};

const RequireAuth = ({ children }) => {
  if (!isTokenValid()) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const location = useLocation();
  const isPublic = publicRoutes.includes(location.pathname);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadResume />} />
                <Route path="/ats-result" element={<ATSResult />} />
                <Route path="/job-match" element={<JobMatch />} />
                <Route path="/ai-suggestions" element={<AISuggestions />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/history" element={<History />} />
                <Route path="/privacy" element={<PrivacySettings />} />
                <Route path="*" element={<Navigate to={isPublic ? "/" : "/dashboard"} replace />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;
