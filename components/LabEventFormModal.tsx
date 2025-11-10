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
        
        <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-l-4 border-pink-500">
          <p className="text-xs sm:text-sm font-semibold text-pink-800">
            {event ? 'Actualiza los detalles del evento de Pervex Lab' : 'Registra un nuevo evento de innovación y experimentación'}
          </p>
        </div>

        <div>
          <label htmlFor="topic" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Tema del Evento</label>
          <input 
            type="text" 
            name="topic" 
            value={formData.topic} 
            onChange={handleChange} 
            required 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base" 
            placeholder="Ej: Workshop de Design Thinking"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="date" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Fecha</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base" 
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Tipo de Evento</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
            >
              {Object.values(LabEventType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="owner_user_id" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Responsable</label>
            <select 
              name="owner_user_id" 
              value={formData.owner_user_id} 
              onChange={handleChange} 
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
            >
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="client_id" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Cliente (Opcional)</label>
            <select 
              name="client_id" 
              value={formData.client_id} 
              onChange={handleChange} 
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
            >
              <option value="">Evento General</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="outcomes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Resultados y Hallazgos</label>
          <textarea 
            name="outcomes" 
            value={formData.outcomes} 
            onChange={handleChange} 
            rows={3} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base resize-none" 
            placeholder="Describe los principales resultados, aprendizajes y conclusiones del evento..."
          />
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
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
          >
            {event ? 'Actualizar Evento' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </Modal>
  );
};