
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { useData } from '../hooks/useData';

interface UsabilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    clientId: string;
    platformId: string;
  } | null;
}

export const UsabilityFormModal: React.FC<UsabilityFormModalProps> = ({ isOpen, onClose, context }) => {
  const { clients, techPlatforms, techUsability, upsertTechUsability } = useData();
  
  const [usageCount, setUsageCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString().split('T')[0]);

  const { client, platform, existingRecord } = useMemo(() => {
    if (!context) return { client: null, platform: null, existingRecord: null };
    
    const client = clients.find(c => c.id === context.clientId);
    const platform = techPlatforms.find(p => p.id === context.platformId);
    const existingRecord = techUsability.find(tu => tu.client_id === context.clientId && tu.platform_id === context.platformId);

    return { client, platform, existingRecord };
  }, [context, clients, techPlatforms, techUsability]);

  useEffect(() => {
    if (isOpen && existingRecord) {
      setUsageCount(existingRecord.usage_count);
      setLastUpdate(existingRecord.last_update.split('T')[0]);
    } else if (isOpen) {
      setUsageCount(0);
      setLastUpdate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, existingRecord]);

  const calculatedPct = useMemo(() => {
    if (!client || client.headcount === 0) return 0;
    return Math.min(100, Math.round((usageCount / client.headcount) * 100));
  }, [usageCount, client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    
    upsertTechUsability(context.clientId, context.platformId, usageCount, lastUpdate);
    onClose();
  };
  
  if (!context || !client || !platform) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Actualizar Usabilidad: ${platform.display_name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-800">Cliente: <span className="font-normal">{client.name}</span></p>
            <p className="font-semibold text-gray-800">Dotación Total: <span className="font-normal">{client.headcount.toLocaleString('es-CL')}</span></p>
        </div>

        <div>
          <label htmlFor="usageCount" className="block text-sm font-medium text-gray-700">
            N° de Usuarios / Transacciones
          </label>
          <input 
            type="number" 
            name="usageCount" 
            id="usageCount" 
            value={usageCount} 
            onChange={(e) => setUsageCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" 
          />
        </div>

        <div>
          <label htmlFor="lastUpdate" className="block text-sm font-medium text-gray-700">Fecha de Actualización</label>
          <input 
            type="date" 
            name="lastUpdate" 
            id="lastUpdate" 
            value={lastUpdate} 
            onChange={(e) => setLastUpdate(e.target.value)}
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-white text-gray-900" 
          />
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-700">Porcentaje de Uso Calculado</p>
            <p className="text-3xl font-bold text-blue-800">{calculatedPct}%</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm sm:text-base order-2 sm:order-1">Cancelar</button>
          <button type="submit" className="bg-[#0055B8] text-white px-4 py-2 rounded-md hover:bg-[#003F8C] text-sm sm:text-base order-1 sm:order-2">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};
