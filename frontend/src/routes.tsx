// src/routes.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/ProfilePage";
import RegisterForm from "@/components/auth/RegisterForm";
import AppLayout from "@/components/layout/AppLayout";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import LoginForm from "./components/auth/LoginForm";
import IbmProfilePage from "./components/auth/IbmProfilePage";
import PasswordSetup from "./components/auth/PasswordSetup";

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/IBMProfile" element={<IbmProfilePage />} />
      <Route path="/forgot-password" element={<PasswordSetup />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <AppLayout>
              {user?.role.toLocaleLowerCase() === "employee" && (
                <EmployeeDashboard />
              )}
              {user?.role.toLocaleLowerCase() === "manager" && (
                <ManagerDashboard />
              )}
              {["admin", "superadmin", "head"].includes(
                user?.role.toLocaleLowerCase() || ""
              ) && <AdminDashboard />}
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/*  Protected Profile Route */}
      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <AppLayout>
              <Profile />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
