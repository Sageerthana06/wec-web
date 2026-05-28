import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Session verification failed:', error.message);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authService.login(username, password);
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        setLoading(false);
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message || 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
