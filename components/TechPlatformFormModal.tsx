import React, { useState } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';

interface TechPlatformFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechPlatformFormModal: React.FC<TechPlatformFormModalProps> = ({ isOpen, onClose }) => {
  const { addTechPlatform } = useData();
  const [formData, setFormData] = useState({
    code: '',
    display_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Limpiar error al cambiar el input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await addTechPlatform(formData);
      onClose();
      setFormData({ code: '', display_name: '' });
    } catch (err: any) {
      setError(err.message || 'Error al crear el sistema');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Sistema Tecnológico">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">Nombre del Sistema</label>
          <input 
            type="text" 
            name="display_name" 
            id="display_name" 
            value={formData.display_name} 
            onChange={handleChange} 
            required 
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 disabled:opacity-50" 
          />
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Código (sin espacios, ej. 'NUEVO_SISTEMA')</label>
          <input 
            type="text" 
            name="code" 
            id="code" 
            value={formData.code} 
            onChange={handleChange} 
            required 
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 disabled:opacity-50" 
          />
          <p className="mt-1 text-xs text-gray-500">
            Códigos existentes: SINEX, NSS, WF_SELECCION, ECRMOVIL, PORTAL_CLIENTE, PANEL_SUPERVISORES
          </p>
        </div>
        <div className="flex justify-end pt-4 space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Sistema'}
          </button>
        </div>
      </form>
    </Modal>
  );
};