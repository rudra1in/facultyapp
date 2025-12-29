import { Routes, Route, Navigate } from "react-router-dom";

// ==================== ROUTE GUARD ====================
import ProtectedRoute from "../routes/ProtectedRoute";

// ==================== LAYOUT ====================
import DashboardLayout from "../layout/DashboardLayout";

// ==================== PUBLIC ====================
import AnimatedLandingPage from "../components/home/AnimatedLandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterFacultyPage from "../pages/auth/RegisterFacultyPage";

// ==================== ADMIN ONLY ====================
import AdminFacultyPage from "../pages/auth/AdminFacultyPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
// ==================== SHARED PAGES ====================
import HomePage from "../pages/HomePage";
import OverviewPage from "../pages/OverviewPage";
import CategoriesPage from "../pages/CategoriesPage";
import CalendarPage from "../pages/CalendarPage";
import ContactsPage from "../pages/ContactsPage";
import ReportsPage from "../pages/ReportsPage";
import NotificationPage from "../pages/NotificationPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import MessagesPage from "../pages/MessagesPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<AnimatedLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterFacultyPage />} />

      {/* ================= DASHBOARD (ADMIN + FACULTY) ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "FACULTY"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<HomePage />} />
        <Route path="overview" element={<OverviewPage />} />

        {/* NORMAL FACULTY PAGE (if you want one) */}
        <Route path="faculty" element={<HomePage />} />

        <Route path="categories" element={<CategoriesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* ================= ADMIN ONLY ================= */}
        <Route
          path="admin-faculty"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminFacultyPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default AppRouter;
