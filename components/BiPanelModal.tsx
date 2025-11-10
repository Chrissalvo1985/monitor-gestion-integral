import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { BiClientPanel, ImplementationStatus, BiPanel } from '../types';

interface BiPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  panelData: { clientPanel: BiClientPanel, panelInfo: BiPanel } | null;
}

export const BiPanelModal: React.FC<BiPanelModalProps> = ({ isOpen, onClose, panelData }) => {
  const { users, updateBiClientPanel, updateBiPanel } = useData();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<{clientPanel: Partial<BiClientPanel>, panelInfo: Partial<BiPanel>}>({ clientPanel: {}, panelInfo: {} });

  useEffect(() => {
    if (panelData) {
      setFormData({
          clientPanel: {
            ...panelData.clientPanel,
            target_date: panelData.clientPanel.target_date ? panelData.clientPanel.target_date.split('T')[0] : '',
          },
          panelInfo: panelData.panelInfo
      });
    }
  }, [panelData, isOpen]);

  const handleChangeClientPanel = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        clientPanel: {
            ...prev.clientPanel,
            [name]: name === 'progress_pct' ? parseInt(value, 10) : value
        }
    }));
  };
  
  const handleChangePanelInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          panelInfo: { ...prev.panelInfo, [name]: value }
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (panelData) {
      updateBiClientPanel({ ...panelData.clientPanel, ...formData.clientPanel });
      updateBiPanel({ ...panelData.panelInfo, ...formData.panelInfo });
    }
    onClose();
  };
  
  if (!panelData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar: ${panelData.panelInfo.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">
          <p className="text-xs sm:text-sm font-semibold text-sky-800">Configuración del Panel BI</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nombre del Panel</label>
          <input 
            type="text" 
            name="name" 
            value={formData.panelInfo.name || ''} 
            onChange={handleChangePanelInfo} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base" 
            placeholder="Ej: Dashboard Financiero"
          />
        </div>
        
        <div>
          <label htmlFor="embed_url" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">URL del Panel</label>
          <input 
            type="url" 
            name="embed_url" 
            value={formData.panelInfo.embed_url || ''} 
            onChange={handleChangePanelInfo} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base font-mono text-xs sm:text-sm" 
            placeholder="https://..."
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">Estado de Implementación</p>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
          <select 
            name="status" 
            id="status" 
            value={formData.clientPanel.status} 
            onChange={handleChangeClientPanel} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
          >
            {Object.values(ImplementationStatus).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="progress_pct" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Progreso: <span className="text-sky-700 text-base sm:text-lg font-bold">{formData.clientPanel.progress_pct || 0}%</span>
          </label>
          <input 
            type="range" 
            name="progress_pct" 
            id="progress_pct" 
            min="0" 
            max="100" 
            value={formData.clientPanel.progress_pct || 0} 
            onChange={handleChangeClientPanel} 
            disabled={!isAdmin} 
            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-600 disabled:opacity-50" 
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
            value={formData.clientPanel.owner_user_id} 
            onChange={handleChangeClientPanel} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base"
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
            value={formData.clientPanel.target_date} 
            onChange={handleChangeClientPanel} 
            disabled={!isAdmin} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base" 
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Notas</label>
          <textarea 
            name="notes" 
            id="notes" 
            value={formData.clientPanel.notes || ''} 
            onChange={handleChangeClientPanel} 
            disabled={!isAdmin} 
            rows={3} 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 transition-all text-sm sm:text-base resize-none" 
            placeholder="Agrega notas adicionales sobre el panel..."
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
          {isAdmin && (
            <button 
              type="submit" 
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-500 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
            >
              Guardar Cambios
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};