import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const hasAdminAccess = (role) => {
  if (!role) return false;
  const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
  return normalized === "ROLE_ADMIN" || normalized === "ROLE_SECRETARY";
};

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const canManageUsers = hasAdminAccess(user?.role);

  const navItems = [
    { to: "/", label: "Home" },
    ...(canManageUsers ? [{ to: "/users", label: "Users" }] : []),
  ];

  const isActive = (to) => (to === "/" ? location.pathname === to : location.pathname.startsWith(to));

  return (
    <div className="app-layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f8fafc",
        }}
      >
        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive(item.to) ? "#0f172a" : "#475569",
                background: isActive(item.to) ? "#e2e8f0" : "transparent",
                fontWeight: 600,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>{user.username}</div>
                <div style={{ fontSize: "12px", color: "#475569" }}>{user.role}</div>
              </div>
              <button
                onClick={logout}
                style={{
                  border: "1px solid #e2e8f0",
                  background: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <span style={{ color: "#94a3b8" }}>Not signed in</span>
          )}
        </div>
      </header>
      <main style={{ flex: 1, padding: "16px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
