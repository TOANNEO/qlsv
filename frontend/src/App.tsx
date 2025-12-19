import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, Role, useAuth } from './application/auth/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './presentation/pages/HomePage';
import SemestersPage from './presentation/pages/SemestersPage';
import UnauthorizedPage from './presentation/pages/UnauthorizedPage';

function ProtectedRoute({ roles, children }: { roles?: Role[]; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Navigation />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/semesters"
            element={
              <ProtectedRoute roles={['ADMIN', 'SECRETARY']}>
                <SemestersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
