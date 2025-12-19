import { NavLink } from 'react-router-dom';
import { ALL_ROLES, Role, useAuth } from '../application/auth/AuthContext';

const semesterRoles: Role[] = ['ADMIN', 'SECRETARY'];

export default function Navigation() {
  const { user, setUser } = useAuth();

  return (
    <aside className="sidebar">
      <h1>Student Attendance</h1>
      <div className="badge" style={{ marginBottom: '12px' }}>
        <span>Signed in</span>
        <strong>{user?.role ?? 'UNKNOWN'}</strong>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            Trang chủ
          </NavLink>
        </li>
        {user && semesterRoles.includes(user.role) && (
          <li>
            <NavLink to="/semesters">Học kỳ</NavLink>
          </li>
        )}
      </ul>

      <div className="role-picker">
        <label htmlFor="roleSelect">Giả lập vai trò</label>
        <select
          id="roleSelect"
          value={user?.role ?? ''}
          onChange={(event) =>
            setUser({
              name: user?.name ?? 'Demo User',
              role: event.target.value as Role,
              token: user?.token
            })
          }
        >
          {ALL_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
