import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { LabEvent, LabEventType } from '../types';

interface LabEventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: LabEvent | null;
}

export const LabEventFormModal: React.FC<LabEventFormModalProps> = ({ isOpen, onClose, event }) => {
  const { users, clients, addLabEvent, updateLabEvent } = useData();
  
  const getInitialFormData = () => ({
    topic: '',
    date: new Date().toISOString().split('T')[0],
    type: LabEventType.WORKSHOP,
    owner_user_id: users[0]?.id || '',
    client_id: '',
    outcomes: ''
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (event) {
      setFormData({
        topic: event.topic,
        date: event.date.split('T')[0],
        type: event.type,
        owner_user_id: event.owner_user_id,
        client_id: event.client_id || '',
        outcomes: event.outcomes,
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [event, isOpen, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData, client_id: formData.client_id || undefined };
    if (event) {
      updateLabEvent({ ...event, ...submissionData });
    } else {
      addLabEvent(submissionData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Editar Evento' : 'Crear Nuevo Evento'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Tema del Evento</label>
          <input type="text" name="topic" value={formData.topic} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
              <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
                {Object.values(LabEventType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div>
              <label htmlFor="owner_user_id" className="block text-sm font-medium text-gray-700">Responsable</label>
              <select name="owner_user_id" value={formData.owner_user_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">Cliente (Opcional)</label>
              <select name="client_id" value={formData.client_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
                <option value="">General</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
        </div>
         <div>
          <label htmlFor="outcomes" className="block text-sm font-medium text-gray-700">Resultados</label>
          <textarea name="outcomes" value={formData.outcomes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C]">Guardar Evento</button>
        </div>
      </form>
    </Modal>
  );
};