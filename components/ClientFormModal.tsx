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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label htmlFor="headcount" className="block text-sm font-medium text-gray-700">Dotación</label>
          <input type="number" name="headcount" id="headcount" value={formData.headcount} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label htmlFor="gerencia" className="block text-sm font-medium text-gray-700">Gerencia</label>
          <select name="gerencia" id="gerencia" value={formData.gerencia} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900">
            {Object.values(Gerencia).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700">Responsable</label>
          <input 
            type="text" 
            name="owner_name" 
            id="owner_name" 
            value={formData.owner_name} 
            onChange={handleChange} 
            required 
            placeholder="Nombre del responsable"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900" 
          />
          <p className="mt-1 text-xs text-gray-500">
            Escribe el nombre del responsable. Si no existe, se creará automáticamente.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm sm:text-base order-2 sm:order-1">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C] text-sm sm:text-base order-1 sm:order-2">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};