import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { RISK_COLORS } from '../constants';
import { TechImplementation, ImplementationStatus, RiskLevel, TechPlatform } from '../types';
import { useData } from '../hooks/useData';
import { TechImplementationModal } from '../components/TechImplementationModal';
import { TechPlatformFormModal } from '../components/TechPlatformFormModal';

const TechMonitorView: React.FC = () => {
    const { clients, techPlatforms, techImplementations, users, addTechImplementation, selectedClientId } = useData();
    const [editingImpl, setEditingImpl] = useState<TechImplementation | null>(null);
    const [isPlatformModalOpen, setPlatformModalOpen] = useState(false);

    const clientImplementations = useMemo(() => {
        if (!selectedClientId || selectedClientId === 'all') return [];
        return techImplementations.filter(impl => impl.client_id === selectedClientId);
    }, [techImplementations, selectedClientId]);
    
    const getImplementationForPlatform = (platformId: string): TechImplementation | undefined => {
        return clientImplementations.find(impl => impl.platform_id === platformId);
    };
    
    const handlePlan = (platformId: string) => {
        if (!selectedClientId || selectedClientId === 'all') return;
        const newImpl = {
            client_id: selectedClientId,
            platform_id: platformId,
            status: ImplementationStatus.PLANIFICADO,
            progress_pct: 0,
            owner_user_id: users[0]?.id || '',
            risk_level: RiskLevel.BAJO,
        };
        addTechImplementation(newImpl);
    };

    const handleEdit = (impl: TechImplementation) => {
        setEditingImpl(impl);
    };

    const selectedClient = clients.find(c => c.id === selectedClientId);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Tecnología</h1>
                <button onClick={() => setPlatformModalOpen(true)} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all">
                    + Añadir Nuevo Sistema
                </button>
            </div>

            {selectedClientId && selectedClientId !== 'all' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {techPlatforms.map(platform => {
                        const impl = getImplementationForPlatform(platform.id);
                        const owner = users.find(u => u.id === impl?.owner_user_id);
                        const isOverdue = impl?.target_date && new Date(impl.target_date) < new Date() && impl.status !== ImplementationStatus.IMPLEMENTADO;

                        return (
                            <Card key={platform.id} className="flex flex-col">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-800">{platform.display_name}</h3>
                                    {impl ? <StatusBadge status={impl.status} /> : <StatusBadge status={ImplementationStatus.NO_INICIADO} />}
                                </div>
                                
                                <div className="flex-grow mt-4 space-y-4">
                                    {impl ? (
                                        <>
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700">Progreso</span>
                                                    <span className="text-sm font-medium text-gray-700">{impl.progress_pct}%</span>
                                                </div>
                                                <ProgressBar progress={impl.progress_pct} />
                                            </div>
                                            <div className="text-sm text-gray-500 space-y-2">
                                                <p><strong>Owner:</strong> {owner?.name || 'N/A'}</p>
                                                <p><strong>Fecha Objetivo:</strong> {impl.target_date ? new Date(impl.target_date).toLocaleDateString() : 'N/A'}</p>
                                                <p><strong>Última Act.:</strong> {new Date(impl.last_update).toLocaleDateString()}</p>
                                                <p><strong>Riesgo:</strong> <span className={`font-semibold ${RISK_COLORS[impl.risk_level]}`}>{impl.risk_level}</span></p>
                                                {impl.notes && <p className="p-2 bg-gray-100 rounded text-xs"><strong>Notas:</strong> {impl.notes}</p>}
                                            </div>
                                            {isOverdue && <div className="p-2 text-sm text-red-700 bg-red-100 rounded-md font-bold text-center">SLA VENCIDO</div>}
                                        </>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center text-gray-500">
                                            <p>No iniciado para {selectedClient?.name}.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    {impl ? (
                                        <button onClick={() => handleEdit(impl)} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold">
                                            Editar
                                        </button>
                                    ) : (
                                        <button onClick={() => handlePlan(platform.id)} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold">
                                            Planificar
                                        </button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500 py-8">Por favor, seleccione un cliente en la barra superior para gestionar sus implementaciones tecnológicas.</p>
                </Card>
            )}
            <TechImplementationModal isOpen={!!editingImpl} implementation={editingImpl} onClose={() => setEditingImpl(null)} />
            <TechPlatformFormModal isOpen={isPlatformModalOpen} onClose={() => setPlatformModalOpen(false)} />
        </div>
    );
};

export default TechMonitorView;