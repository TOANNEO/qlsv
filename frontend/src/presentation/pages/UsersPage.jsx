import React, { useEffect, useMemo, useState } from "react";
import loadUsersUseCase from "../../application/usecases/loadUsers";
import createUserUseCase from "../../application/usecases/createUser";
import updateUserUseCase from "../../application/usecases/updateUser";
import deleteUserUseCase from "../../application/usecases/deleteUser";
import { useAuth } from "../context/AuthContext";

const initialFormState = {
  username: "",
  email: "",
  role: "STUDENT",
  firstName: "",
  lastName: "",
  studentCode: "",
  lecturerCode: "",
  department: "",
  enabled: true,
};

const roleOptions = [
  { label: "Student", value: "STUDENT" },
  { label: "Lecturer", value: "LECTURER" },
  { label: "Secretary", value: "SECRETARY" },
  { label: "Admin", value: "ADMIN" },
];

const UserForm = ({ title, formData, onChange, onSubmit, onCancel, disabledFields = {} }) => {
  return (
    <div style={{ padding: "16px", minWidth: "320px" }}>
      <h3 style={{ marginBottom: "12px" }}>{title}</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span>Username</span>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange({ ...formData, username: e.target.value })}
            required
            disabled={disabledFields.username}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span>Email</span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span>Role</span>
          <select
            value={formData.role}
            onChange={(e) => onChange({ ...formData, role: e.target.value })}
            disabled={disabledFields.role}
            required
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span>First name</span>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
              required
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span>Last name</span>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
              required
            />
          </label>
        </div>
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span>Student code</span>
            <input
              type="text"
              value={formData.studentCode}
              onChange={(e) => onChange({ ...formData, studentCode: e.target.value })}
              placeholder="Optional"
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span>Lecturer code</span>
            <input
              type="text"
              value={formData.lecturerCode}
              onChange={(e) => onChange({ ...formData, lecturerCode: e.target.value })}
              placeholder="Optional"
            />
          </label>
        </div>
        <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span>Department</span>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => onChange({ ...formData, department: e.target.value })}
            placeholder="Optional"
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={formData.enabled}
            onChange={(e) => onChange({ ...formData, enabled: e.target.checked })}
          />
          <span>Enabled</span>
        </label>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
          <button type="button" onClick={onCancel} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            Cancel
          </button>
          <button type="submit" style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #2563eb", background: "#2563eb", color: "white" }}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20,
      padding: "16px",
    }}
    role="dialog"
    aria-modal
  >
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        position: "relative",
      }}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          border: "none",
          background: "transparent",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

const UsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [pageMeta, setPageMeta] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async (page = pageMeta.page, size = pageMeta.size) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadUsersUseCase({ page, size, token });
      setUsers(data?.content || []);
      setPageMeta({
        page: data?.number ?? page,
        size: data?.size ?? size,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 0,
      });
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const openCreate = () => {
    setFormData(initialFormState);
    setCreateOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      role: user.role || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      studentCode: user.studentCode || "",
      lecturerCode: user.lecturerCode || "",
      department: user.department || "",
      enabled: user.enabled !== undefined ? user.enabled : true,
    });
    setEditOpen(true);
  };

  const closeModals = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setEditingUser(null);
  };

  const handleCreate = async () => {
    try {
      await createUserUseCase({ ...formData }, { token });
      closeModals();
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  const handleEdit = async () => {
    if (!editingUser) return;
    try {
      await updateUserUseCase(editingUser.id, { ...formData }, { token });
      closeModals();
      fetchUsers(pageMeta.page, pageMeta.size);
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete user ${user.username}?`);
    if (!confirmed) return;
    try {
      await deleteUserUseCase(user.id, { token });
      fetchUsers(pageMeta.page, pageMeta.size);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const pageSummary = useMemo(() => {
    if (pageMeta.totalElements === 0) return "No records";
    const start = pageMeta.page * pageMeta.size + 1;
    const end = Math.min(pageMeta.totalElements, (pageMeta.page + 1) * pageMeta.size);
    return `${start}-${end} of ${pageMeta.totalElements}`;
  }, [pageMeta]);

  const changePageSize = (nextSize) => {
    setPageMeta((prev) => ({ ...prev, size: nextSize, page: 0 }));
    fetchUsers(0, nextSize);
  };

  const changePage = (direction) => {
    const nextPage = Math.min(Math.max(pageMeta.page + direction, 0), Math.max(pageMeta.totalPages - 1, 0));
    setPageMeta((prev) => ({ ...prev, page: nextPage }));
    fetchUsers(nextPage, pageMeta.size);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ margin: 0 }}>Users</h2>
          <p style={{ color: "#475569", margin: 0 }}>Manage accounts for students, lecturers, secretaries, and admins.</p>
        </div>
        <button
          onClick={openCreate}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            border: "1px solid #1d4ed8",
            cursor: "pointer",
          }}
        >
          + New user
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: "12px", padding: "10px 12px", borderRadius: "8px", background: "#fef2f2", color: "#b91c1c" }}>
          {error}
        </div>
      )}

      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8fafc", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Username</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Email</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Role</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Name</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Codes</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Department</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Enabled</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{user.username}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{user.email}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{user.role}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                      {user.studentCode || "—"}
                      {user.lecturerCode ? (
                        <>
                          <br />
                          <small style={{ color: "#475569" }}>Lecturer: {user.lecturerCode}</small>
                        </>
                      ) : null}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{user.department || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          color: user.enabled ? "#15803d" : "#b91c1c",
                          background: user.enabled ? "#dcfce7" : "#fee2e2",
                        }}
                      >
                        {user.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => openEdit(user)}
                          style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ef4444", background: "#fee2e2", color: "#b91c1c", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => changePage(-1)}
              disabled={pageMeta.page === 0 || loading}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer" }}
            >
              Previous
            </button>
            <button
              onClick={() => changePage(1)}
              disabled={pageMeta.page + 1 >= pageMeta.totalPages || loading}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer" }}
            >
              Next
            </button>
            <span style={{ color: "#475569", fontSize: "14px" }}>{pageSummary}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#475569" }}>Page size</span>
            <select
              value={pageMeta.size}
              onChange={(e) => changePageSize(Number(e.target.value))}
              disabled={loading}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {createOpen && (
        <Modal onClose={closeModals}>
          <UserForm
            title="Create user"
            formData={formData}
            onChange={setFormData}
            onSubmit={handleCreate}
            onCancel={closeModals}
            disabledFields={{ username: false, role: false }}
          />
        </Modal>
      )}

      {editOpen && editingUser && (
        <Modal onClose={closeModals}>
          <UserForm
            title={`Update ${editingUser.username}`}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleEdit}
            onCancel={closeModals}
            disabledFields={{ username: true, role: false }}
          />
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
