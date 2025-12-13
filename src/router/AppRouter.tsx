import { Routes, Route, Navigate } from "react-router-dom";

import AnimatedLandingPage from "../components/home/AnimatedLandingPage";
import DashboardLayout from "../layout/DashboardLayout";

import HomePage from "../pages/HomePage";
import OverviewPage from "../pages/OverviewPage";
import FacultyPage from "../pages/FacultyPage";
import CategoriesPage from "../pages/CategoriesPage";
import ReportsPage from "../pages/ReportsPage";
import CalendarPage from "../pages/CalendarPage";
import ContactsPage from "../pages/ContactsPage";
import NotificationPage from "../pages/NotificationPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<AnimatedLandingPage />} />

      {/* Dashboard (OPEN, NO LOGIN) */}
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route path="home" element={<HomePage />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="calender" element={<CalendarPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* /dashboard → /dashboard/home */}
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
