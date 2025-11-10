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
        
        <div className="p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">
          <p className="text-xs sm:text-sm font-semibold text-sky-800">
            Crea un nuevo dashboard de Business Intelligence para el cliente seleccionado
          </p>
        </div>

        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nombre del Panel</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm sm:text-base" 
            placeholder="Ej: Dashboard Operacional Q1"
          />
        </div>
        <div>
          <label htmlFor="short_desc" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Descripción Corta</label>
          <textarea 
            name="short_desc" 
            value={formData.short_desc} 
            onChange={handleChange} 
            rows={2} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm sm:text-base resize-none" 
            placeholder="Breve descripción del contenido y objetivo del panel..."
          />
        </div>
        <div>
          <label htmlFor="area" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Área</label>
          <input 
            type="text" 
            name="area" 
            value={formData.area} 
            onChange={handleChange} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm sm:text-base" 
            placeholder="Ej: Ventas, Finanzas, Operaciones"
          />
        </div>
        <div>
          <label htmlFor="embed_url" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">URL del Panel</label>
          <input 
            type="url" 
            name="embed_url" 
            value={formData.embed_url} 
            onChange={handleChange} 
            required 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm sm:text-base font-mono text-xs sm:text-sm" 
            placeholder="https://app.powerbi.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">
            URL completa del dashboard embebido (Power BI, Tableau, Looker, etc.)
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
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-500 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
          >
            Crear Panel BI
          </button>
        </div>
      </form>
    </Modal>
  );
};