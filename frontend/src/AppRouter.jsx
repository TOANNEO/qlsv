import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./presentation/components/Layout";
import UsersPage from "./presentation/pages/UsersPage";
import { AuthProvider, useAuth } from "./presentation/context/AuthContext";

const normalizeRole = (role) => (role && role.startsWith("ROLE_")) ? role : role ? `ROLE_${role}` : null;

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (roles && roles.length > 0) {
    const normalized = normalizeRole(user.role);
    const allowed = roles.map(normalizeRole);
    if (!allowed.includes(normalized)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  return children;
};

const HomePage = () => (
  <div style={{ padding: "12px" }}>
    <h2 style={{ marginBottom: "8px" }}>Dashboard</h2>
    <p style={{ color: "#475569" }}>Select a section from the navigation.</p>
  </div>
);

const UnauthorizedPage = () => (
  <div style={{ padding: "12px" }}>
    <h2 style={{ marginBottom: "8px", color: "#b91c1c" }}>Access denied</h2>
    <p style={{ color: "#475569" }}>You do not have permission to view this page.</p>
  </div>
);

const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={["ROLE_ADMIN", "ROLE_SECRETARY", "ADMIN", "SECRETARY"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRouter;
