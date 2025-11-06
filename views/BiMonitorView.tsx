import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { BiClientPanel, ImplementationStatus, BiPanel } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { BiPanelModal } from '../components/BiPanelModal';
import { BiPanelCreateModal } from '../components/BiPanelCreateModal';
import { filterClients } from '../utils/calculations';

const BiMonitorView: React.FC = () => {
    const { clients, biPanels, biClientPanels, users, selectedClientId, selectedResponsibleId, selectedGerencia } = useData();
    const { isAdmin } = useAuth();
    const [editingPanel, setEditingPanel] = useState<{clientPanel: BiClientPanel, panelInfo: BiPanel} | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const handleEdit = (clientPanel: BiClientPanel) => {
        const panelInfo = biPanels.find(p => p.id === clientPanel.panel_id);
        if (panelInfo) {
            setEditingPanel({ clientPanel, panelInfo });
        }
    };
    
    const filteredClients = useMemo(() => {
        return filterClients(clients, selectedClientId, selectedResponsibleId, selectedGerencia);
    }, [clients, selectedClientId, selectedResponsibleId, selectedGerencia]);
    
    const clientPanels = useMemo(() => {
        if (filteredClients.length === 0) return [];
        const filteredClientIds = new Set(filteredClients.map(c => c.id));
        return biClientPanels.filter(p => filteredClientIds.has(p.client_id));
    }, [biClientPanels, filteredClients]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de BI</h1>
                {isAdmin && (
                    <button onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={filteredClients.length !== 1}>
                        + Crear Panel BI
                    </button>
                )}
            </div>
            
            {filteredClients.length > 0 ? (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-700">
                        {filteredClients.length === 1 
                            ? `Paneles de BI para ${filteredClients[0].name}`
                            : `Paneles de BI (${filteredClients.length} clientes)`}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientPanels.map(cp => {
                            const panelInfo = biPanels.find(p => p.id === cp.panel_id);
                            const owner = users.find(u => u.id === cp.owner_user_id);
                            const client = clients.find(c => c.id === cp.client_id);
                            if (!panelInfo) return null;

                            const isOverdue = cp.target_date && new Date(cp.target_date) < new Date() && cp.status !== ImplementationStatus.IMPLEMENTADO;
                            const isImplemented = cp.status === ImplementationStatus.IMPLEMENTADO;

                            return (
                                <Card key={cp.id} className="flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                    {client?.name || 'N/A'}
                                                </span>
                                                {panelInfo.area && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                        {panelInfo.area}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">{panelInfo.name}</h3>
                                        </div>
                                        <StatusBadge status={cp.status} />
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-4 min-h-[2.5rem]">{panelInfo.short_desc}</p>
                                    
                                    <div className="mt-auto space-y-3">
                                        <div>
                                            <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
                                                <span>Progreso</span><span>{cp.progress_pct}%</span>
                                            </div>
                                            <ProgressBar progress={cp.progress_pct} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div>
                                                <p className="font-semibold text-gray-700">Owner</p>
                                                <p className="truncate">{owner?.name || 'N/A'}</p>
                                            </div>
                                            {cp.target_date && (
                                                <div>
                                                    <p className="font-semibold text-gray-700">Fecha Objetivo</p>
                                                    <p className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                                        {new Date(cp.target_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            {cp.implemented_at && (
                                                <div>
                                                    <p className="font-semibold text-gray-700">Implementado</p>
                                                    <p>{new Date(cp.implemented_at).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-700">Última Actualización</p>
                                                <p>{new Date(cp.last_update).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {isOverdue && (
                                            <div className="p-2 text-xs text-red-700 bg-red-50 rounded-md font-medium text-center border border-red-200">
                                                ⚠️ Fecha objetivo vencida
                                            </div>
                                        )}

                                        {cp.notes && (
                                            <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Notas:</p>
                                                <p className="text-xs text-gray-600">{cp.notes}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                                            {panelInfo.embed_url && (
                                                <a 
                                                    href={panelInfo.embed_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="w-full text-center bg-[#0055B8] text-white py-2.5 rounded-lg hover:bg-[#003F8C] transition-colors text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    {isImplemented ? 'Abrir Panel' : 'Ver Panel'}
                                                </a>
                                            )}
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleEdit(cp)} 
                                                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm"
                                                >
                                                    Editar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                        {clientPanels.length === 0 && 
                            <Card className="col-span-full">
                                <p className="text-center text-gray-500 py-8">No hay paneles de BI asignados a este cliente. ¡Crea el primero!</p>
                            </Card>
                        }
                    </div>
                </div>
            ) : (
                 <Card>
                    <p className="text-center text-gray-500 py-8">Por favor, seleccione un cliente en la barra superior para gestionar sus paneles de BI.</p>
                </Card>
            )}
            <BiPanelModal isOpen={!!editingPanel} panelData={editingPanel} onClose={() => setEditingPanel(null)} />
            <BiPanelCreateModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
        </div>
    );
};

export default BiMonitorView;