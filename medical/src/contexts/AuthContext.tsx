import React, { createContext, useContext, useEffect, useState } from 'react';
import { validateSession, logoutUser } from '@/lib/authService';

interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  lastLogin: string;
  sessions: number;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('mediprior_token');
        const userData = localStorage.getItem('mediprior_user');

        if (token && userData) {
          // Validate session with backend
          const response = await validateSession(token);
          
          if (response.success && response.user) {
            // Session is valid, set user data
            const userInfo: User = {
              uid: response.user.id,
              name: response.user.fullName,
              email: response.user.email,
              role: response.user.role,
              avatar: null,
              lastLogin: response.user.lastLogin,
              sessions: response.user.sessions,
              joinDate: response.user.createdAt
            };
            setUser(userInfo);
          } else {
            // Session is invalid, clear storage
            localStorage.removeItem('mediprior_token');
            localStorage.removeItem('mediprior_user');
            localStorage.removeItem('mediprior_remember');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('mediprior_token');
        localStorage.removeItem('mediprior_user');
        localStorage.removeItem('mediprior_remember');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('mediprior_token', token);
    localStorage.setItem('mediprior_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('mediprior_token');
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('mediprior_token');
      localStorage.removeItem('mediprior_user');
      localStorage.removeItem('mediprior_remember');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 