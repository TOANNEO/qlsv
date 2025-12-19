import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Role = 'ADMIN' | 'SECRETARY' | 'LECTURER' | 'STUDENT';

export interface User {
  name: string;
  role: Role;
  token?: string;
}

interface AuthContextValue {
  user: User | null;
  setUser: (user: User) => void;
}

const DEFAULT_USER: User = {
  name: 'Demo Admin',
  role: 'ADMIN'
};

const STORAGE_KEY = 'qlsv.currentUser';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as User;
      } catch (error) {
        console.warn('Cannot parse cached user, resetting to default.', error);
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser: setUserState
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}

export const ALL_ROLES: Role[] = ['ADMIN', 'SECRETARY', 'LECTURER', 'STUDENT'];
