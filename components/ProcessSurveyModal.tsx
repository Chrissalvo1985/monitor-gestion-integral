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
        
        <div className="p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <p className="text-xs sm:text-sm font-semibold text-indigo-800">Actualiza el estado del levantamiento de procesos</p>
        </div>

        <div>
          <label htmlFor="status" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Estado General</label>
          <select 
            name="status" 
            id="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
          >
            {Object.values(ProcessSurveyStatus).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="owner_user_id" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Responsable</label>
          <select 
            name="owner_user_id" 
            id="owner_user_id" 
            value={formData.owner_user_id} 
            onChange={handleChange} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
          >
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">Avance por Componente</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="mapeo_proceso_pct" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Mapeo: <span className="text-indigo-700 font-bold">{formData.mapeo_proceso_pct || 0}%</span>
            </label>
            <input 
              type="range" 
              name="mapeo_proceso_pct" 
              value={formData.mapeo_proceso_pct || 0} 
              onChange={handleChange} 
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            />
          </div>
          <div>
            <label htmlFor="procedimientos_pct" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Procedimientos: <span className="text-indigo-700 font-bold">{formData.procedimientos_pct || 0}%</span>
            </label>
            <input 
              type="range" 
              name="procedimientos_pct" 
              value={formData.procedimientos_pct || 0} 
              onChange={handleChange} 
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            />
          </div>
          <div>
            <label htmlFor="controles_pct" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Controles: <span className="text-indigo-700 font-bold">{formData.controles_pct || 0}%</span>
            </label>
            <input 
              type="range" 
              name="controles_pct" 
              value={formData.controles_pct || 0} 
              onChange={handleChange} 
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            />
          </div>
          <div>
            <label htmlFor="evidencias_pct" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Evidencias: <span className="text-indigo-700 font-bold">{formData.evidencias_pct || 0}%</span>
            </label>
            <input 
              type="range" 
              name="evidencias_pct" 
              value={formData.evidencias_pct || 0} 
              onChange={handleChange} 
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <label htmlFor="notes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Notas y Observaciones</label>
          <textarea 
            name="notes" 
            id="notes" 
            value={formData.notes || ''} 
            onChange={handleChange} 
            rows={3} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base resize-none" 
            placeholder="Agrega comentarios sobre el levantamiento..."
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
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};