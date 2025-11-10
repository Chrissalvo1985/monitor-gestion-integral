import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { Client, Gerencia } from '../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, client }) => {
  const { users, addClient, updateClient } = useData();
  const [formData, setFormData] = useState({
    name: '',
    gerencia: Gerencia.Rbravo,
    owner_name: '',
    headcount: 0,
  });

  useEffect(() => {
    if (client) {
      // Buscar el nombre del usuario actual
      const ownerUser = users.find(u => u.id === client.owner_user_id);
      setFormData({
        name: client.name,
        gerencia: client.gerencia,
        owner_name: ownerUser?.name || '',
        headcount: client.headcount,
      });
    } else {
      setFormData({
        name: '',
        gerencia: Gerencia.Rbravo,
        owner_name: '',
        headcount: 0,
      });
    }
  }, [client, isOpen, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'headcount' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preparar datos para enviar
    const clientData = {
      name: formData.name,
      gerencia: formData.gerencia,
      owner_name: formData.owner_name.trim(),
      headcount: formData.headcount,
    };
    
    try {
      if (client) {
        await updateClient({ ...client, ...clientData });
      } else {
        await addClient(clientData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar el cliente. Por favor intenta nuevamente.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? 'Editar Cliente' : 'Crear Nuevo Cliente'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nombre del Cliente</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base" 
            placeholder="Ej: Empresa ABC S.A."
          />
        </div>
        <div>
          <label htmlFor="headcount" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Dotación (N° de colaboradores)</label>
          <input 
            type="number" 
            name="headcount" 
            id="headcount" 
            value={formData.headcount} 
            onChange={handleChange} 
            required 
            min="0"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base" 
            placeholder="Ej: 250"
          />
        </div>
        <div>
          <label htmlFor="gerencia" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Gerencia</label>
          <select 
            name="gerencia" 
            id="gerencia" 
            value={formData.gerencia} 
            onChange={handleChange} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
          >
            {Object.values(Gerencia).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="owner_name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Responsable</label>
          <input 
            type="text" 
            name="owner_name" 
            id="owner_name" 
            value={formData.owner_name} 
            onChange={handleChange} 
            required 
            placeholder="Nombre del responsable"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base" 
          />
          <p className="mt-1.5 text-xs text-gray-500 flex items-start">
            <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Si el responsable no existe, se creará automáticamente como usuario.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-gradient-to-r from-[#FF7E2D] to-orange-500 hover:from-orange-500 hover:to-[#FF7E2D] text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
          >
            {client ? 'Guardar Cambios' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};