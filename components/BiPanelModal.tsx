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
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Panel</label>
          <input type="text" name="name" value={formData.panelInfo.name || ''} onChange={handleChangePanelInfo} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50" />
        </div>
        
        <div>
          <label htmlFor="embed_url" className="block text-sm font-medium text-gray-700">URL del Panel</label>
          <input type="url" name="embed_url" value={formData.panelInfo.embed_url || ''} onChange={handleChangePanelInfo} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50" />
        </div>

        <hr className="border-gray-200" />
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
          <select name="status" id="status" value={formData.clientPanel.status} onChange={handleChangeClientPanel} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50">
            {Object.values(ImplementationStatus).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        <div>
            <label htmlFor="progress_pct" className="block text-sm font-medium text-gray-700">Progreso: {formData.clientPanel.progress_pct || 0}%</label>
            <input type="range" name="progress_pct" id="progress_pct" min="0" max="100" value={formData.clientPanel.progress_pct || 0} onChange={handleChangeClientPanel} disabled={!isAdmin} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
        </div>

        <div>
          <label htmlFor="owner_user_id" className="block text-sm font-medium text-gray-700">Responsable</label>
          <select name="owner_user_id" id="owner_user_id" value={formData.clientPanel.owner_user_id} onChange={handleChangeClientPanel} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50">
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">Fecha Objetivo</label>
          <input type="date" name="target_date" id="target_date" value={formData.clientPanel.target_date} onChange={handleChangeClientPanel} disabled={!isAdmin} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50" />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea name="notes" id="notes" value={formData.clientPanel.notes || ''} onChange={handleChangeClientPanel} disabled={!isAdmin} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900 disabled:opacity-50" />
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
          {isAdmin && (
            <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C]">Guardar Cambios</button>
          )}
        </div>
      </form>
    </Modal>
  );
};