
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
        
        <div>
          <label htmlFor="plan_name" className="block text-sm font-medium text-gray-700">Nombre del Plan</label>
          <input type="text" name="plan_name" id="plan_name" value={formData.plan_name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>

        <div>
          <label htmlFor="area_id" className="block text-sm font-medium text-gray-700">Área</label>
          <select name="area_id" id="area_id" value={formData.area_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
            {processAreas.map(a => <option key={a.id} value={a.id}>{a.display_name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
            {Object.values(ImplementationStatus).filter(s => s !== ImplementationStatus.DEPRECATED).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
            <label htmlFor="progress_pct" className="block text-sm font-medium text-gray-700">Progreso: {formData.progress_pct || 0}%</label>
            <input type="range" name="progress_pct" id="progress_pct" min="0" max="100" value={formData.progress_pct || 0} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>

        <div>
          <label htmlFor="owner_user_id" className="block text-sm font-medium text-gray-700">Responsable</label>
          <select name="owner_user_id" id="owner_user_id" value={formData.owner_user_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">Fecha Objetivo</label>
          <input type="date" name="target_date" id="target_date" value={formData.target_date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C]">Guardar Plan</button>
        </div>
      </form>
    </Modal>
  );
};
