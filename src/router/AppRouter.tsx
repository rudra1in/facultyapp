import { Routes, Route, Navigate } from "react-router-dom";

// ==================== LAYOUTS ====================
import DashboardLayout from "../layout/DashboardLayout";
import MobileLayout from "../layout/MobileLayout";

// ==================== PAGES ====================
import AnimatedLandingPage from "../components/home/AnimatedLandingPage";

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

// ==================== AUTH ====================
import LoginPage from "../pages/auth/LoginPage";
import RegisterFacultyPage from "../pages/auth/RegisterFacultyPage";
import AdminFacultyPage from "../pages/auth/AdminFacultyPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<AnimatedLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterFacultyPage />} />

      {/* ================= ADMIN DASHBOARD ================= */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<HomePage />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="faculty" element={<AdminFacultyPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* ================= FACULTY (MOBILE) ================= */}
      <Route path="/faculty" element={<MobileLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* ================= SAFETY FALLBACK ================= */}
      <Route
        path="/dashboard/*"
        element={<Navigate to="/dashboard/home" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
