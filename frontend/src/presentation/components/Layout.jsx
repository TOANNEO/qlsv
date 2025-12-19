import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { RoleLabels } from '../../domain/models/user';
import { Button } from './Button';

const navItems = [
  { to: '/', label: 'Tổng quan' },
  { to: '/courses', label: 'Lớp học phần' },
  { to: '/attendance', label: 'Điểm danh' },
  { to: '/leave-requests', label: 'Đơn xin phép' },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell grid min-h-screen grid-cols-1 bg-slate-50 text-slate-900 lg:grid-cols-[260px_1fr]">
      <aside className="hidden h-full border-r border-slate-200 bg-white/90 backdrop-blur lg:block">
        <div className="flex flex-col gap-8 p-6">
          <div className="space-y-1">
            <div className="text-sm font-semibold uppercase tracking-wide text-brand-700">QLSV</div>
            <p className="text-sm text-slate-500">Cổng điều phối lớp học &amp; điểm danh</p>
          </div>
          <nav className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition hover:bg-brand-50 hover:text-brand-700 ${
                    isActive ? 'bg-brand-50 text-brand-700' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-xs font-semibold uppercase text-slate-500">Đăng nhập</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">{user?.fullName || user?.username}</div>
            <p className="text-xs text-slate-500">{RoleLabels[user?.role] || user?.role}</p>
            <Button onClick={logout} variant="ghost" className="mt-3 px-0 text-sm text-red-600">
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="text-xs text-slate-500">Xin chào</p>
            <p className="text-sm font-semibold text-slate-900">{user?.fullName || user?.username}</p>
          </div>
          <Button onClick={logout} variant="ghost" className="text-sm text-red-600">
            Đăng xuất
          </Button>
        </header>

        <section className="scroll-area flex-1 p-4 md:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
