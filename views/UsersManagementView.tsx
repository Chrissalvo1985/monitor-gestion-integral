import React, { useState } from 'react';
import { Card } from '../components/Card';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { api } from '../lib/api';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

export const UsersManagementView: React.FC = () => {
  const { users, refreshUsers } = useData();
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems: paginatedUsers,
    totalItems,
    goToPage,
    handleItemsPerPageChange,
  } = usePagination(users, 10);

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg">No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleChangePassword = (userId: string) => {
    setSelectedUserId(userId);
    setIsPasswordModalOpen(true);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.deleteUser(userId);
      await refreshUsers();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el usuario');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={handleNew}
          className="bg-[#0055B8] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#003F8C] transition-colors font-semibold text-sm sm:text-base whitespace-nowrap"
        >
          + Nuevo Usuario
        </button>
      </div>

      <Card className="overflow-hidden flex flex-col lg:max-h-[calc(100vh-280px)]">
        <div className="overflow-x-auto overflow-y-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 min-w-[120px]">Nombre</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 min-w-[180px]">Email</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 min-w-[100px]">Rol</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700 min-w-[100px]">Estado</th>
                  <th className="text-right py-3 px-3 sm:px-4 font-semibold text-gray-700 min-w-[200px]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">{user.name}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-600 whitespace-nowrap">{user.email}</td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2 sm:gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleChangePassword(user.id)}
                          className="text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          Contraseña
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </Card>

      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSuccess={refreshUsers}
        />
      )}

      {isPasswordModalOpen && selectedUserId && (
        <PasswordChangeModal
          userId={selectedUserId}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
};

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    active: user?.active !== false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (user) {
        // Actualizar
        await api.updateUser(user.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: formData.active,
        });
      } else {
        // Crear
        if (!formData.password || formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }
        await api.createUser(formData);
      }
      await onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                disabled={loading}
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              disabled={loading}
              className="mr-2"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Usuario Activo</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0055B8] text-white rounded-md hover:bg-[#003F8C] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PasswordChangeModalProps {
  userId: string;
  onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ userId, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await api.changePassword(userId, password);
      alert('Contraseña cambiada correctamente');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Cambiar Contraseña</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              placeholder="Repetir contraseña"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0055B8] text-white rounded-md hover:bg-[#003F8C] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

