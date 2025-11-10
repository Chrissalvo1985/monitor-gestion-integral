
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { CollaboratorExperiencePlan, ImplementationStatus } from '../types';

interface CollaboratorExperiencePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CollaboratorExperiencePlan | null;
}

export const CollaboratorExperiencePlanModal: React.FC<CollaboratorExperiencePlanModalProps> = ({ isOpen, onClose, plan }) => {
  const { selectedClientId, users, processAreas, addCollaboratorExperiencePlan, updateCollaboratorExperiencePlan } = useData();

  const getInitialState = () => ({
    plan_name: '',
    area_id: processAreas[0]?.id || '',
    status: ImplementationStatus.PLANIFICADO,
    progress_pct: 0,
    owner_user_id: users[0]?.id || '',
    target_date: '',
    description: '',
  });
  
  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (plan) {
      setFormData({
        plan_name: plan.plan_name,
        area_id: plan.area_id,
        status: plan.status,
        progress_pct: plan.progress_pct,
        owner_user_id: plan.owner_user_id,
        target_date: plan.target_date ? plan.target_date.split('T')[0] : '',
        description: plan.description || '',
      });
    } else {
      setFormData(getInitialState());
    }
  }, [plan, isOpen, processAreas, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'progress_pct' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || selectedClientId === 'all') return;

    const submissionData = { ...formData, client_id: selectedClientId };

    if (plan) {
      updateCollaboratorExperiencePlan({ ...plan, ...submissionData });
    } else {
      addCollaboratorExperiencePlan(submissionData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={plan ? 'Editar Plan de Experiencia' : 'Crear Plan de Experiencia'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="p-3 bg-teal-50 rounded-lg border-l-4 border-teal-500">
          <p className="text-xs sm:text-sm font-semibold text-teal-800">
            {plan ? 'Edita los detalles del plan existente' : 'Define un nuevo plan de experiencia del colaborador'}
          </p>
        </div>

        <div>
          <label htmlFor="plan_name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nombre del Plan</label>
          <input 
            type="text" 
            name="plan_name" 
            id="plan_name" 
            value={formData.plan_name} 
            onChange={handleChange} 
            required 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base" 
            placeholder="Ej: Capacitación en habilidades blandas"
          />
        </div>

        <div>
          <label htmlFor="area_id" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Área</label>
          <select 
            name="area_id" 
            id="area_id" 
            value={formData.area_id} 
            onChange={handleChange} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
          >
            {processAreas.map(a => <option key={a.id} value={a.id}>{a.display_name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
          <select 
            name="status" 
            id="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
          >
            {Object.values(ImplementationStatus).filter(s => s !== ImplementationStatus.DEPRECATED).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="progress_pct" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Progreso: <span className="text-teal-700 text-base sm:text-lg font-bold">{formData.progress_pct || 0}%</span>
          </label>
          <input 
            type="range" 
            name="progress_pct" 
            id="progress_pct" 
            min="0" 
            max="100" 
            value={formData.progress_pct || 0} 
            onChange={handleChange} 
            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
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
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
          >
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
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
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base" 
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
          <textarea 
            name="description" 
            id="description" 
            value={formData.description || ''} 
            onChange={handleChange} 
            rows={3} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base resize-none" 
            placeholder="Describe los objetivos y alcances del plan..."
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
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
          >
            {plan ? 'Guardar Cambios' : 'Crear Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
