import React, { useState } from 'react';
import { Card } from '../components/Card';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { api } from '../lib/api';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

export const UsersManagementView: React.FC = () => {
  const { users, refreshUsers, clients } = useData();
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isClientAssignModalOpen, setIsClientAssignModalOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState<User | null>(null);

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

  const handleAssignClients = (user: User) => {
    setAssigningUser(user);
    setIsClientAssignModalOpen(true);
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
    <div className="flex flex-col h-full lg:overflow-hidden">
      <div className="flex-shrink-0 space-y-2 sm:space-y-4 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <button
            onClick={handleNew}
            className="bg-gradient-to-r from-[#0055B8] to-blue-600 hover:from-blue-600 hover:to-[#0055B8] text-white font-bold py-1.5 px-3 sm:py-2 sm:px-5 rounded-lg shadow-md transition-all text-xs sm:text-base whitespace-nowrap"
          >
            + Nuevo Usuario
          </button>
        </div>
      </div>

      <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto overflow-y-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-xs sm:text-sm divide-y divide-gray-200">
              <thead className="text-[10px] sm:text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold min-w-[120px]">Nombre</th>
                  <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold min-w-[180px]">Email</th>
                  <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold min-w-[100px]">Rol</th>
                  <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold min-w-[100px]">Estado</th>
                  <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold min-w-[120px]">Clientes</th>
                  <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-right font-semibold min-w-[180px] sm:min-w-[260px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 whitespace-nowrap">{user.email}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className={`inline-flex px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className={`inline-flex px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      {user.role === 'admin' ? (
                        <span className="text-gray-500 italic">Todos</span>
                      ) : (
                        <span className="text-gray-700">
                          {user.assigned_clients?.length || 0} asignado{user.assigned_clients?.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-1.5 sm:gap-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-[10px] sm:text-sm transition-colors"
                          title="Editar usuario"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleChangePassword(user.id)}
                          className="text-green-600 hover:text-green-800 hover:underline font-medium text-[10px] sm:text-sm transition-colors"
                          title="Cambiar contraseña"
                        >
                          Contraseña
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleAssignClients(user)}
                            className="text-purple-600 hover:text-purple-800 hover:underline font-medium text-[10px] sm:text-sm transition-colors"
                            title="Asignar clientes"
                          >
                            Clientes
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="text-red-600 hover:text-red-800 hover:underline font-medium text-[10px] sm:text-sm transition-colors"
                          title="Eliminar usuario"
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

      {isClientAssignModalOpen && assigningUser && (
        <ClientAssignModal
          user={assigningUser}
          clients={clients}
          onClose={() => {
            setIsClientAssignModalOpen(false);
            setAssigningUser(null);
          }}
          onSuccess={refreshUsers}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nombre completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={loading}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={loading}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          {!user && (
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                disabled={loading}
                minLength={6}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
                placeholder="Mínimo 6 caracteres"
              />
              <p className="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 6 caracteres</p>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Rol del usuario</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
              disabled={loading}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
            >
              <option value="user">Usuario estándar</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              disabled={loading}
              className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
              Usuario activo (puede iniciar sesión)
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-[#0055B8] to-blue-600 hover:from-blue-600 hover:to-[#0055B8] text-white rounded-lg disabled:opacity-50 font-bold shadow-md transition-all text-sm sm:text-base"
            >
              {loading ? 'Guardando...' : 'Guardar Usuario'}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Cambiar Contraseña</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nueva Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
              placeholder="Repetir la nueva contraseña"
            />
            <p className="text-xs text-gray-500 mt-1">Ambas contraseñas deben coincidir</p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white rounded-lg disabled:opacity-50 font-bold shadow-md transition-all text-sm sm:text-base"
            >
              {loading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ClientAssignModalProps {
  user: User;
  clients: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const ClientAssignModal: React.FC<ClientAssignModalProps> = ({ user, clients, onClose, onSuccess }) => {
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(user.assigned_clients || []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleClient = (clientId: string) => {
    setSelectedClientIds(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClientIds.length === filteredClients.length) {
      // Deseleccionar todos los filtrados
      setSelectedClientIds(prev =>
        prev.filter(id => !filteredClients.some(c => c.id === id))
      );
    } else {
      // Seleccionar todos los filtrados
      setSelectedClientIds(prev => {
        const newIds = filteredClients.map(c => c.id);
        return [...new Set([...prev, ...newIds])];
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.updateUserClients(user.id, selectedClientIds);
      await onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al asignar clientes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Asignar Clientes</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Usuario: <span className="font-semibold text-purple-700">{user.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 mt-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm mb-4">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cliente por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              <span className="text-purple-700 text-base sm:text-lg">{selectedClientIds.length}</span> de {clients.length} cliente{clients.length !== 1 ? 's' : ''} seleccionado{selectedClientIds.length !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs sm:text-sm text-purple-700 hover:text-purple-900 font-bold hover:underline transition-colors"
            >
              {selectedClientIds.length === filteredClients.length && filteredClients.length > 0 ? 'Deseleccionar' : 'Seleccionar'} visibles
            </button>
          </div>

          <div className="border-2 border-gray-200 rounded-lg overflow-hidden flex-1 min-h-0 max-h-96">
            {filteredClients.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm sm:text-base font-medium">
                  {searchTerm ? 'No se encontraron clientes' : 'No hay clientes disponibles'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 overflow-y-auto max-h-full">
                {filteredClients.map(client => (
                  <label
                    key={client.id}
                    className="flex items-center p-3 sm:p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClientIds.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                      className="mr-3 h-4 w-4 sm:h-5 sm:w-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-purple-700 transition-colors">{client.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        <span className="inline-flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          {client.gerencia}
                        </span>
                        <span className="mx-1.5">•</span>
                        <span className="inline-flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {client.headcount} colaboradores
                        </span>
                      </div>
                    </div>
                    {selectedClientIds.includes(client.id) && (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg disabled:opacity-50 font-bold shadow-md transition-all text-sm sm:text-base"
            >
              {loading ? 'Guardando...' : 'Guardar Asignación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

