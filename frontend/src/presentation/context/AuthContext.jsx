import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
  setToken: () => {},
});

const storageKey = "qlsv_auth";

const loadFromStorage = () => {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null,
    };
  } catch (error) {
    console.warn("Failed to parse auth data", error);
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadFromStorage().user);
  const [token, setToken] = useState(() => loadFromStorage().token);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ user, token });
    window.localStorage.setItem(storageKey, payload);
  }, [user, token]);

  const login = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
  };

  const value = useMemo(
    () => ({ user, token, login, logout, setUser, setToken }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
