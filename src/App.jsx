import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import { SocketProvider } from './context/SocketContext';

// ── Public pages ──────────────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// ── User pages ────────────────────────────────────────────────────────────────
import Dashboard from './pages/Dashboard';
import BrowseJobs from './pages/BrowseJobs';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import MyWork from './pages/MyWork';
import Conversations from './pages/Conversations';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import MyProfile from './pages/MyProfile';
import PublicProfile from './pages/PublicProfile';
import SearchWorkers from './pages/SearchWorkers';
import WorkerProfileSetup from './pages/WorkerProfileSetup';
import Portfolio from './pages/Portfolio';
import Reviews from './pages/Reviews';
import Verification from './pages/Verification';
import Wallet from './pages/Wallet';
import History from './pages/History';
import Help from './pages/Help';


// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminJobs from './pages/admin/AdminJobs';
import AdminVerifications from './pages/admin/AdminVerifications';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>

              {/* ── Public ── */}
              <Route path="/"         element={<HomeRoute />} />
              <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/terms"    element={<Terms />} />
              <Route path="/privacy"  element={<Privacy />} />

              {/* ── Protected ── */}
              <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/jobs"            element={<PrivateRoute><BrowseJobs /></PrivateRoute>} />
              <Route path="/jobs/post"       element={<PrivateRoute><PostJob /></PrivateRoute>} />
              <Route path="/jobs/my"         element={<PrivateRoute><MyJobs /></PrivateRoute>} />
              <Route path="/my-work"         element={<PrivateRoute><MyWork /></PrivateRoute>} />
              <Route path="/wallet"          element={<PrivateRoute><Wallet /></PrivateRoute>} />
              <Route path="/history"         element={<PrivateRoute><History /></PrivateRoute>} />
              <Route path="/conversations"   element={<PrivateRoute><Conversations /></PrivateRoute>} />
              <Route path="/chat/:userId"    element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/notifications"   element={<PrivateRoute><Notifications /></PrivateRoute>} />
              <Route path="/profile"         element={<PrivateRoute><MyProfile /></PrivateRoute>} />
              <Route path="/profile/:userId" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />
              <Route path="/workers"         element={<PrivateRoute><SearchWorkers /></PrivateRoute>} />
              <Route path="/workers/:workerId" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />
              <Route path="/profile-setup"   element={<PrivateRoute><WorkerProfileSetup /></PrivateRoute>} />
              <Route path="/portfolio"       element={<PrivateRoute><Portfolio /></PrivateRoute>} />
              <Route path="/portfolio/:workerId" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
              <Route path="/reviews/:workerId"   element={<PrivateRoute><Reviews /></PrivateRoute>} />
              <Route path="/verification"    element={<PrivateRoute><Verification /></PrivateRoute>} />
              <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />


              {/* ── Admin ── */}
              {/*
                FIX: AdminLogin.jsx navigates to '/admin/dashboard' after a
                successful login, and AdminLayout.jsx's sidebar nav item also
                points to '/admin/dashboard' — but only '/admin' was
                registered before. Every login and every "Dashboard" click in
                the admin sidebar matched nothing, fell through to the
                catch-all route below, and silently redirected to the public
                landing page. Both paths now resolve to the same component.
              */}
              <Route path="/admin/login"         element={<AdminLogin />} />
              <Route path="/admin"               element={<AdminDashboard />} />
              <Route path="/admin/dashboard"     element={<AdminDashboard />} />
              <Route path="/admin/users"         element={<AdminUsers />} />
              <Route path="/admin/reports"       element={<AdminReports />} />
              <Route path="/admin/jobs"          element={<AdminJobs />} />
              <Route path="/admin/verifications" element={<AdminVerifications />} />

              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </LangProvider>
    </AuthProvider>
  );
}