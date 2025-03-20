
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simple mock authentication
    // In a real app, you would make an API call to a backend
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes: any email with a password will work
    if (password.length < 6) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password.length < 6) {
      setIsLoading(false);
      throw new Error('Password must be at least 6 characters');
    }
    
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      name,
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
