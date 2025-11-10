import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { TechImplementation, ImplementationStatus, RiskLevel } from '../types';

interface TechImplementationModalProps {
  isOpen: boolean;
  onClose: () => void;
  implementation: TechImplementation | null;
}

export const TechImplementationModal: React.FC<TechImplementationModalProps> = ({ isOpen, onClose, implementation }) => {
  const { users, techPlatforms, updateTechImplementation, deleteTechImplementation } = useData();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<Partial<TechImplementation>>({});

  useEffect(() => {
    if (implementation) {
      setFormData({
        ...implementation,
        target_date: implementation.target_date ? implementation.target_date.split('T')[0] : '',
      });
    }
  }, [implementation, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'progress_pct' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (implementation) {
      updateTechImplementation({ ...implementation, ...formData, last_update: new Date().toISOString() });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (implementation) {
      try {
        await deleteTechImplementation(implementation.id);
        onClose();
      } catch (error) {
        // El error ya se maneja en deleteTechImplementation
      }
    }
  };
  
  const platform = techPlatforms.find(p => p.id === implementation?.platform_id);

  if (!implementation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar: ${platform?.display_name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <p className="text-xs sm:text-sm font-semibold text-purple-800">Gestión de implementación tecnológica</p>
        </div>

        <div>
          <label htmlFor="status" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
          <select 
            name="status" 
            id="status" 
            value={formData.status} 
            onChange={handleChange} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
          >
            {Object.values(ImplementationStatus).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="progress_pct" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Progreso: <span className="text-purple-700 text-base sm:text-lg font-bold">{formData.progress_pct || 0}%</span>
          </label>
          <input 
            type="range" 
            name="progress_pct" 
            id="progress_pct" 
            min="0" 
            max="100" 
            value={formData.progress_pct || 0} 
            onChange={handleChange} 
            disabled={!isAdmin} 
            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50" 
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label htmlFor="owner_user_id" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Responsable</label>
          <select 
            name="owner_user_id" 
            id="owner_user_id" 
            value={formData.owner_user_id} 
            onChange={handleChange} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
          >
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="risk_level" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nivel de Riesgo</label>
          <select 
            name="risk_level" 
            id="risk_level" 
            value={formData.risk_level} 
            onChange={handleChange} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
          >
            {Object.values(RiskLevel).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="target_date" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Fecha Objetivo</label>
          <input 
            type="date" 
            name="target_date" 
            id="target_date" 
            value={formData.target_date} 
            onChange={handleChange} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base" 
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Notas</label>
          <textarea 
            name="notes" 
            id="notes" 
            value={formData.notes || ''} 
            onChange={handleChange} 
            disabled={!isAdmin} 
            rows={3} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base resize-none" 
            placeholder="Agrega comentarios sobre el estado de la implementación..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          {isAdmin && (
            <button 
              type="button" 
              onClick={handleDelete} 
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base order-2 sm:order-1"
            >
              Eliminar Implementación
            </button>
          )}
          <div className={`flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 ${!isAdmin ? 'w-full' : 'order-1 sm:order-2'}`}>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            {isAdmin && (
              <button 
                type="submit" 
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
              >
                Guardar Cambios
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};