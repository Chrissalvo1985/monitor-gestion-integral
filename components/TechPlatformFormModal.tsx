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
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded text-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <p className="text-xs sm:text-sm font-semibold text-purple-800">
            Agrega un nuevo sistema tecnológico a la plataforma
          </p>
        </div>

        <div>
          <label htmlFor="display_name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nombre del Sistema</label>
          <input 
            type="text" 
            name="display_name" 
            id="display_name" 
            value={formData.display_name} 
            onChange={handleChange} 
            required 
            disabled={isSubmitting}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base" 
            placeholder="Ej: Sistema de Gestión Documental"
          />
        </div>
        <div>
          <label htmlFor="code" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Código (identificador único)</label>
          <input 
            type="text" 
            name="code" 
            id="code" 
            value={formData.code} 
            onChange={handleChange} 
            required 
            disabled={isSubmitting}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base font-mono uppercase" 
            placeholder="NUEVO_SISTEMA"
          />
          <div className="mt-1.5 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <p className="font-medium mb-1">Formato: sin espacios, mayúsculas, separado por guiones bajos</p>
            <p className="text-gray-500">Ejemplos: SINEX, NSS, WF_SELECCION, ECRMOVIL, PORTAL_CLIENTE</p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md transition-all text-sm sm:text-base"
          >
            {isSubmitting ? 'Guardando...' : 'Crear Sistema'}
          </button>
        </div>
      </form>
    </Modal>
  );
};