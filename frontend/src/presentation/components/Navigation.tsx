import { NavLink } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export function Navigation() {
  const { hasRole, user } = useAuth();

  const links = [
    { to: '/', label: 'Tổng quan', roles: null as string[] | null },
    { to: '/semesters', label: 'Học kỳ', roles: ['ADMIN', 'SECRETARY'] },
  ];

  return (
    <aside className="sidebar">
      <h1>QLSV Portal</h1>
      <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
        {user ? `${user.name} (${user.roles.join(', ')})` : 'Khách'}
      </p>
      <nav className="nav-links">
        {links
          .filter((link) => !link.roles || hasRole(link.roles))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
