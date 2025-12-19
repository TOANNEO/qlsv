import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { UserProfile } from '../../domain/models/user';
import { getDefaultUser, persistUser } from '../../infrastructure/apiClient';

interface AuthContextValue {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => getDefaultUser());

  useEffect(() => {
    persistUser(user);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      hasRole: (roles: string[]) => {
        if (!user) return false;
        return user.roles.some((role) => roles.includes(role));
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
