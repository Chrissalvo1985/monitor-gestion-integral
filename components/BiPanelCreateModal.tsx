import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { ImplementationStatus } from '../types';

interface BiPanelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiPanelCreateModal: React.FC<BiPanelCreateModalProps> = ({ isOpen, onClose }) => {
  const { users, selectedClientId, addBiPanel } = useData();
  const [formData, setFormData] = useState({
    name: '',
    short_desc: '',
    area: '',
    embed_url: '',
    code: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', short_desc: '', area: '', embed_url: '', code: '' });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, code: prev.name.toUpperCase().replace(/\s/g, '_') }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || selectedClientId === 'all') return;
    
    const {name, code, short_desc, area, embed_url} = formData;

    const newPanelData = { name, code, short_desc, area, embed_url };
    const newClientPanelData = {
        client_id: selectedClientId,
        status: ImplementationStatus.PLANIFICADO,
        progress_pct: 0,
        owner_user_id: users[0]?.id || ''
    };
    
    addBiPanel(newPanelData, newClientPanelData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Panel de BI">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Panel</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label htmlFor="short_desc" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
          <textarea name="short_desc" value={formData.short_desc} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">Área</label>
          <input type="text" name="area" value={formData.area} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div>
          <label htmlFor="embed_url" className="block text-sm font-medium text-gray-700">URL del Panel</label>
          <input type="url" name="embed_url" value={formData.embed_url} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C]">Crear Panel</button>
        </div>
      </form>
    </Modal>
  );
};