import { createContext, useState, useEffect, useCallback } from 'react';
import * as authAPI from '../api/authAPI';
import {
  getToken,
  setToken,
  setRefreshToken,
  getUser,
  setUser,
  clearAuth,
} from '../utils/localStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setUserState(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authAPI.register(userData);
    const { user, token, refreshToken } = response.data.data;
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user);
    setUserState(user);
    setIsAuthenticated(true);
    return user;
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authAPI.login(credentials);
    const { user, token, refreshToken } = response.data.data;
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user);
    setUserState(user);
    setIsAuthenticated(true);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth();
      setUserState(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    setUserState(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
