
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
        <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-500">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Cliente:</span> {client.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Dotación Total:</span> 
              <span className="text-purple-700 font-bold text-base sm:text-lg ml-1">
                {client.headcount.toLocaleString('es-CL')}
              </span> colaboradores
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="usageCount" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            N° de Usuarios / Transacciones
          </label>
          <input 
            type="number" 
            name="usageCount" 
            id="usageCount" 
            value={usageCount} 
            onChange={(e) => setUsageCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
            required 
            min="0"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base" 
            placeholder="Ej: 150"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingresa el número de usuarios activos o transacciones registradas
          </p>
        </div>

        <div>
          <label htmlFor="lastUpdate" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Fecha de Actualización</label>
          <input 
            type="date" 
            name="lastUpdate" 
            id="lastUpdate" 
            value={lastUpdate} 
            onChange={(e) => setLastUpdate(e.target.value)}
            required 
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base" 
          />
        </div>

        <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-xl border-2 border-blue-200 shadow-inner">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-xs sm:text-sm font-semibold text-blue-700">Porcentaje de Uso Calculado</p>
          </div>
          <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            {calculatedPct}%
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${calculatedPct}%` }}
            />
          </div>
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
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-bold shadow-md transition-all text-sm sm:text-base"
          >
            Guardar Usabilidad
          </button>
        </div>
      </form>
    </Modal>
  );
};
