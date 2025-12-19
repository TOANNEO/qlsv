import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: JSX.Element;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { hasRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
