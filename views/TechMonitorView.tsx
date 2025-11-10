import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { NoClientsAccess } from '../components/NoClientsAccess';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { RISK_COLORS } from '../constants';
import { TechImplementation, ImplementationStatus, RiskLevel, TechPlatform } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { TechImplementationModal } from '../components/TechImplementationModal';
import { TechPlatformFormModal } from '../components/TechPlatformFormModal';
import { filterClients } from '../utils/calculations';

const TechMonitorView: React.FC = () => {
    const { clients, techPlatforms, techImplementations, users, addTechImplementation, deleteTechPlatform, selectedClientId, selectedResponsibleId, selectedGerencia } = useData();
    const { isAdmin, hasAssignedClients } = useAuth();
    const [editingImpl, setEditingImpl] = useState<TechImplementation | null>(null);
    const [isPlatformModalOpen, setPlatformModalOpen] = useState(false);

    if (!hasAssignedClients) {
        return <NoClientsAccess />;
    }

    const handleDeletePlatform = async (platformId: string, platformName: string) => {
        try {
            await deleteTechPlatform(platformId);
        } catch (error) {
            // El error ya se maneja en deleteTechPlatform
        }
    };

    const filteredClients = useMemo(() => {
        return filterClients(clients, selectedClientId, selectedResponsibleId, selectedGerencia);
    }, [clients, selectedClientId, selectedResponsibleId, selectedGerencia]);

    // Verificar si todos los filtros están en "all"
    const allFiltersAreAll = useMemo(() => {
        return (selectedClientId === 'all' || !selectedClientId) && 
               (selectedResponsibleId === 'all' || !selectedResponsibleId) && 
               (selectedGerencia === 'all' || !selectedGerencia);
    }, [selectedClientId, selectedResponsibleId, selectedGerencia]);

    const clientImplementations = useMemo(() => {
        if (filteredClients.length === 0 || allFiltersAreAll) return [];
        const filteredClientIds = new Set(filteredClients.map(c => c.id));
        return techImplementations.filter(impl => filteredClientIds.has(impl.client_id));
    }, [techImplementations, filteredClients, allFiltersAreAll]);
    
    const getImplementationForPlatform = (platformId: string): TechImplementation | undefined => {
        return clientImplementations.find(impl => impl.platform_id === platformId);
    };
    
    const handlePlan = (platformId: string) => {
        if (filteredClients.length !== 1) return;
        const newImpl = {
            client_id: filteredClients[0].id,
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

    const selectedClient = filteredClients.length === 1 ? filteredClients[0] : null;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Tecnología</h1>
                {isAdmin && (
                    <button onClick={() => setPlatformModalOpen(true)} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm sm:text-base whitespace-nowrap">
                        + Añadir Nuevo Sistema
                    </button>
                )}
            </div>

            {filteredClients.length > 0 && !allFiltersAreAll ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {techPlatforms.map(platform => {
                        const impl = getImplementationForPlatform(platform.id);
                        const owner = users.find(u => u.id === impl?.owner_user_id);
                        const isOverdue = impl?.target_date && new Date(impl.target_date) < new Date() && impl.status !== ImplementationStatus.IMPLEMENTADO;

                        return (
                            <Card key={platform.id} className="flex flex-col relative p-3">
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeletePlatform(platform.id, platform.display_name)}
                                        className="absolute top-1.5 right-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Eliminar sistema"
                                        aria-label="Eliminar sistema"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                                <div className="flex justify-between items-start pr-6">
                                    <h3 className="text-sm font-bold text-gray-800">{platform.display_name}</h3>
                                    {impl ? <StatusBadge status={impl.status} /> : <StatusBadge status={ImplementationStatus.NO_INICIADO} />}
                                </div>
                                
                                <div className="flex-grow mt-2 space-y-2">
                                    {impl ? (
                                        <>
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-xs font-medium text-gray-700">Progreso</span>
                                                    <span className="text-xs font-medium text-gray-700">{impl.progress_pct}%</span>
                                                </div>
                                                <ProgressBar progress={impl.progress_pct} />
                                            </div>
                                            <div className="text-xs text-gray-500 space-y-1">
                                                <p><strong>Owner:</strong> {owner?.name || 'N/A'}</p>
                                                <p><strong>Fecha Objetivo:</strong> {impl.target_date ? new Date(impl.target_date).toLocaleDateString() : 'N/A'}</p>
                                                <p><strong>Última Act.:</strong> {new Date(impl.last_update).toLocaleDateString()}</p>
                                                <p><strong>Riesgo:</strong> <span className={`font-semibold ${RISK_COLORS[impl.risk_level]}`}>{impl.risk_level}</span></p>
                                                {impl.notes && <p className="p-1.5 bg-gray-100 rounded text-xs"><strong>Notas:</strong> {impl.notes}</p>}
                                            </div>
                                            {isOverdue && <div className="p-1.5 text-xs text-red-700 bg-red-100 rounded-md font-bold text-center">SLA VENCIDO</div>}
                                        </>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">
                                            <p>No iniciado{filteredClients.length === 1 ? ` para ${filteredClients[0].name}` : ''}.</p>
                                        </div>
                                    )}
                                </div>
                                {isAdmin && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        {impl ? (
                                            <button onClick={() => handleEdit(impl)} className="w-full bg-indigo-600 text-white py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-semibold">
                                                Editar
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handlePlan(platform.id)} 
                                                disabled={filteredClients.length !== 1}
                                                className="w-full bg-gray-200 text-gray-700 py-1.5 rounded-lg hover:bg-gray-300 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Planificar
                                            </button>
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500 py-8">Por favor, seleccione filtros en la barra superior para gestionar implementaciones tecnológicas.</p>
                </Card>
            )}
            <TechImplementationModal isOpen={!!editingImpl} implementation={editingImpl} onClose={() => setEditingImpl(null)} />
            <TechPlatformFormModal isOpen={isPlatformModalOpen} onClose={() => setPlatformModalOpen(false)} />
        </div>
    );
};

export default TechMonitorView;