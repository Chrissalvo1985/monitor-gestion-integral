import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { ProcessSurvey, ProcessSurveyStatus } from '../types';

interface ProcessSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: ProcessSurvey | null;
}

export const ProcessSurveyModal: React.FC<ProcessSurveyModalProps> = ({ isOpen, onClose, survey }) => {
  const { users, processAreas, updateProcessSurvey } = useData();
  const [formData, setFormData] = useState<Partial<ProcessSurvey>>({});

  useEffect(() => {
    if (survey) {
      setFormData(survey);
    } else {
      setFormData({});
    }
  }, [survey, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isPct = name.includes('_pct');
    setFormData(prev => ({ ...prev, [name]: isPct ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (survey) {
      updateProcessSurvey({ ...survey, ...formData, last_update: new Date().toISOString() });
    }
    onClose();
  };
  
  const area = processAreas.find(a => a.id === survey?.area_id);

  return (
    <Modal isOpen={isOpen && !!survey} onClose={onClose} title={`Editar Proceso: ${area?.display_name || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado General</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
            {Object.values(ProcessSurveyStatus).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="owner_user_id" className="block text-sm font-medium text-gray-700">Responsable</label>
          <select name="owner_user_id" id="owner_user_id" value={formData.owner_user_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900">
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
                <label htmlFor="mapeo_proceso_pct" className="block text-sm font-medium text-gray-700 mb-2">Mapeo: {formData.mapeo_proceso_pct || 0}%</label>
                <input type="range" name="mapeo_proceso_pct" value={formData.mapeo_proceso_pct || 0} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div>
                <label htmlFor="procedimientos_pct" className="block text-sm font-medium text-gray-700 mb-2">Procedimientos: {formData.procedimientos_pct || 0}%</label>
                <input type="range" name="procedimientos_pct" value={formData.procedimientos_pct || 0} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div>
                <label htmlFor="controles_pct" className="block text-sm font-medium text-gray-700 mb-2">Controles: {formData.controles_pct || 0}%</label>
                <input type="range" name="controles_pct" value={formData.controles_pct || 0} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
             <div>
                <label htmlFor="evidencias_pct" className="block text-sm font-medium text-gray-700 mb-2">Evidencias: {formData.evidencias_pct || 0}%</label>
                <input type="range" name="evidencias_pct" value={formData.evidencias_pct || 0} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm sm:text-base order-2 sm:order-1">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C] text-sm sm:text-base order-1 sm:order-2">Guardar Cambios</button>
        </div>
      </form>
    </Modal>
  );
};