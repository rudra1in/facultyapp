// ------------------------------------------------------
// FIREBASE-FREE + LOGIN-FREE + ROLE-FREE APP.TSX
// ------------------------------------------------------

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import { ThemeProvider } from "./components/ui/ThemeContext";

// ------------------------------------------------------
// Loader — unchanged (your hamster animation)
// ------------------------------------------------------

const spokeAnimation = keyframes`
  from { transform: rotate(0); }
  to { transform: rotate(-1turn); }
`;

const StyledLoaderWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
  color: #1f2937;
  z-index: 2000;
`;

const Loader: React.FC<{ message: string }> = ({ message }) => (
  <StyledLoaderWrapper className="dark:bg-gray-900 dark:text-white">
    <div className="wheel-and-hamster">
      <div className="wheel" />
      <div className="hamster">
        <div className="hamster__body">
          <div className="hamster__head">
            <div className="hamster__ear" />
            <div className="hamster__eye" />
            <div className="hamster__nose" />
          </div>
          <div className="hamster__limb hamster__limb--fr" />
          <div className="hamster__limb hamster__limb--fl" />
          <div className="hamster__limb hamster__limb--br" />
          <div className="hamster__limb hamster__limb--bl" />
          <div className="hamster__tail" />
        </div>
      </div>
      <div className="spoke" />
    </div>
    <p>{message}</p>
  </StyledLoaderWrapper>
);

// ------------------------------------------------------
// Import Pages
// ------------------------------------------------------

import AnimatedLandingPage from "./components/home/AnimatedLandingPage";
import DashboardLayout from "./components/layout/DashboardLayout";

import HomePage from "./pages/HomePage";
import OverviewPage from "./pages/OverviewPage";
import FacultyPage from "./pages/FacultyPage";
import CategoriesPage from "./pages/CategoriesPage";
import ReportsPage from "./pages/ReportsPage";
import CalendarPage from "./pages/CalendarPage";
import ContactsPage from "./pages/ContactsPage";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// ------------------------------------------------------
// ROUTES — LOGIN-FREE, AUTH-FREE, FULL ACCESS
// ------------------------------------------------------

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page ALWAYS shows on "/" */}
      <Route path="/" element={<AnimatedLandingPage />} />

      {/* Dashboard — fully open, no login needed */}
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

        {/* default /dashboard */}
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ------------------------------------------------------
// MAIN APP — NO AUTH PROVIDER NEEDED
// ------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
