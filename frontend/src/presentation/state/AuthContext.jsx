import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, logoutUser } from '../../application/usecases/loginUser';
import { loadCurrentUser } from '../../application/usecases/loadCurrentUser';
import { tokenStorage } from '../../infrastructure/storage/tokenStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => tokenStorage.get());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await loadCurrentUser(token);
        setUser(profile);
      } catch (err) {
        console.error('Không thể tải thông tin người dùng', err);
        logoutUser();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [token]);

  const login = async (credentials) => {
    setError(null);
    try {
      const auth = await loginUser(credentials);
      setToken(auth.token);
      const profile = await loadCurrentUser(auth.token);
      setUser(profile);
      return auth;
    } catch (err) {
      console.error('Đăng nhập thất bại', err);
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
