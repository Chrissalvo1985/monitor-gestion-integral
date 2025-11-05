import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { BiClientPanel, ImplementationStatus, BiPanel } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { BiPanelModal } from '../components/BiPanelModal';
import { BiPanelCreateModal } from '../components/BiPanelCreateModal';

const BiMonitorView: React.FC = () => {
    const { clients, biPanels, biClientPanels, users, selectedClientId } = useData();
    const { isAdmin } = useAuth();
    const [editingPanel, setEditingPanel] = useState<{clientPanel: BiClientPanel, panelInfo: BiPanel} | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const handleEdit = (clientPanel: BiClientPanel) => {
        const panelInfo = biPanels.find(p => p.id === clientPanel.panel_id);
        if (panelInfo) {
            setEditingPanel({ clientPanel, panelInfo });
        }
    };
    
    const clientPanels = useMemo(() => {
        if (!selectedClientId || selectedClientId === 'all') return [];
        return biClientPanels.filter(p => p.client_id === selectedClientId);
    }, [biClientPanels, selectedClientId]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de BI</h1>
                {isAdmin && (
                    <button onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedClientId || selectedClientId === 'all'}>
                        + Crear Panel BI
                    </button>
                )}
            </div>
            
            {selectedClientId && selectedClientId !== 'all' ? (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Paneles de BI para {clients.find(c=>c.id === selectedClientId)?.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientPanels.map(cp => {
                            const panelInfo = biPanels.find(p => p.id === cp.panel_id);
                            const owner = users.find(u => u.id === cp.owner_user_id);
                            if (!panelInfo) return null;

                            return (
                                <Card key={cp.id}>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold">{panelInfo.name}</h3>
                                        <StatusBadge status={cp.status} />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 h-10">{panelInfo.short_desc}</p>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex justify-between mb-1 text-sm font-medium">
                                            <span>Progreso</span><span>{cp.progress_pct}%</span>
                                        </div>
                                        <ProgressBar progress={cp.progress_pct} />
                                        <div className="text-sm text-gray-600">
                                            <p><strong>Owner:</strong> {owner?.name}</p>
                                            <p><strong>Fecha Objetivo:</strong> {cp.target_date ? new Date(cp.target_date).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        {cp.notes && <p className="p-2 bg-gray-100 rounded text-xs"><strong>Notas:</strong> {cp.notes}</p>}

                                        <div className="flex space-x-2 pt-2 border-t border-gray-200">
                                            <button onClick={() => handleEdit(cp)} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold">
                                                Editar
                                            </button>
                                            {cp.status === ImplementationStatus.IMPLEMENTADO && (
                                                <a href={panelInfo.embed_url} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-[#0055B8] text-white py-2 rounded-lg hover:bg-[#003F8C] transition-colors text-sm font-semibold">
                                                    Ver Panel
                                                </a>
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