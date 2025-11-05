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
    owner_user_id: '',
    headcount: 0,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        gerencia: client.gerencia,
        owner_user_id: client.owner_user_id,
        headcount: client.headcount,
      });
    } else {
      setFormData({
        name: '',
        gerencia: Gerencia.Rbravo,
        owner_user_id: users[0]?.id || '',
        headcount: 0,
      });
    }
  }, [client, isOpen, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'headcount' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      updateClient({ ...client, ...formData });
    } else {
      addClient(formData);
    }
    onClose();
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
          <label htmlFor="owner_user_id" className="block text-sm font-medium text-gray-700">Responsable</label>
          <select name="owner_user_id" id="owner_user_id" value={formData.owner_user_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900">
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C]">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};