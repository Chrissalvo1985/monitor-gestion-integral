import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  hasAssignedClients: boolean;
  hasAccessToClient: (clientId: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await api.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = currentUser?.role === 'admin';

  /**
   * Verifica si el usuario tiene clientes asignados
   * - Los admins siempre tienen acceso (se considera que tienen clientes)
   * - Los usuarios normales deben tener al menos un cliente asignado
   */
  const hasAssignedClients = 
    isAdmin || 
    (currentUser?.assigned_clients && currentUser.assigned_clients.length > 0) || 
    false;

  /**
   * Verifica si el usuario actual tiene acceso a un cliente específico
   * - Los admins tienen acceso a todos los clientes
   * - Los usuarios normales solo tienen acceso a sus clientes asignados
   */
  const hasAccessToClient = (clientId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (!currentUser.assigned_clients || currentUser.assigned_clients.length === 0) return false;
    return currentUser.assigned_clients.includes(clientId);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, hasAssignedClients, hasAccessToClient, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

