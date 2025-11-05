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
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50">
            {Object.values(ImplementationStatus).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
            <label htmlFor="progress_pct" className="block text-sm font-medium text-gray-700">Progreso: {formData.progress_pct || 0}%</label>
            <input type="range" name="progress_pct" id="progress_pct" min="0" max="100" value={formData.progress_pct || 0} onChange={handleChange} disabled={!isAdmin} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
        </div>

        <div>
          <label htmlFor="owner_user_id" className="block text-sm font-medium text-gray-700">Responsable</label>
          <select name="owner_user_id" id="owner_user_id" value={formData.owner_user_id} onChange={handleChange} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50">
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

         <div>
          <label htmlFor="risk_level" className="block text-sm font-medium text-gray-700">Nivel de Riesgo</label>
          <select name="risk_level" id="risk_level" value={formData.risk_level} onChange={handleChange} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50">
            {Object.values(RiskLevel).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">Fecha Objetivo</label>
          <input type="date" name="target_date" id="target_date" value={formData.target_date} onChange={handleChange} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50" />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} disabled={!isAdmin} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50" />
        </div>

        <div className="flex justify-between pt-4">
          {isAdmin && (
            <button 
              type="button" 
              onClick={handleDelete} 
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Eliminar Implementación
            </button>
          )}
          <div className={`space-x-3 ${!isAdmin ? 'w-full flex justify-end' : ''}`}>
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
            {isAdmin && (
              <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C]">Guardar Cambios</button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};