import React, { useMemo, useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { Card } from '../components/Card';
import { ImplementationStatus, Client } from '../types';
import { calculateTechProgress, calculateBiProgress, calculateProcessProgress, filterClients } from '../utils/calculations';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { ClientFormModal } from '../components/ClientFormModal';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

const StatusIcon = ({ status }: { status?: ImplementationStatus }) => {
    switch (status) {
        case ImplementationStatus.IMPLEMENTADO:
            return <span title="Implementado" className="text-green-500 text-lg sm:text-2xl">✅</span>;
        case ImplementationStatus.EN_PROGRESO:
            return <span title="En Progreso" className="text-yellow-500 text-lg sm:text-2xl">🕒</span>;
        case ImplementationStatus.PLANIFICADO:
            return <span title="Planificado" className="text-blue-500 text-lg sm:text-2xl">📅</span>;
        case ImplementationStatus.BLOQUEADO:
            return <span title="Bloqueado" className="text-red-500 text-lg sm:text-2xl">🚫</span>;
        case ImplementationStatus.DEPRECATED:
            return <span title="Deprecado" className="text-gray-500 text-lg sm:text-2xl">🗑️</span>;
        case ImplementationStatus.NO_INICIADO:
        default:
            return <span title="No Iniciado" className="text-gray-400 text-lg sm:text-2xl">➖</span>;
    }
};


const DashboardView: React.FC = () => {
    const { clients, techPlatforms, techImplementations, biClientPanels, processSurveys, selectedClientId, selectedResponsibleId, selectedGerencia, deleteClient, users } = useData();
    const { isAdmin } = useAuth();
    const [isClientModalOpen, setClientModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const handleOpenCreateModal = () => {
        setEditingClient(null);
        setClientModalOpen(true);
    };

    const handleOpenEditModal = (client: Client) => {
        setEditingClient(client);
        setClientModalOpen(true);
    };
    
    const filteredClients = useMemo(() => {
        return filterClients(clients, selectedClientId, selectedResponsibleId, selectedGerencia);
    }, [clients, selectedClientId, selectedResponsibleId, selectedGerencia]);

    const {
        currentPage,
        totalPages,
        itemsPerPage,
        paginatedItems: paginatedClients,
        totalItems,
        goToPage,
        handleItemsPerPageChange,
    } = usePagination(filteredClients, 10);

    const kpis = useMemo(() => {
        const relevantClients = filterClients(clients, selectedClientId, selectedResponsibleId, selectedGerencia);
        const relevantClientIds = new Set(relevantClients.map(c => c.id));
        const relevantTech = techImplementations.filter(t => relevantClientIds.has(t.client_id));
        const relevantBi = biClientPanels.filter(b => relevantClientIds.has(b.client_id));
        
        const implementedClients = relevantClients.filter(c => 
            relevantTech.some(ti => ti.client_id === c.id && ti.status === ImplementationStatus.IMPLEMENTADO)
        ).length;
        
        // Conteo de paneles BI: si hay filtros muestra el total de los clientes filtrados, si no hay filtros muestra el total general
        const biModelsCount = relevantBi.length;
        
        // Calcular implementadas vs planificadas para Tech
        // Implementadas: IMPLEMENTADO
        // Planificadas: PLANIFICADO, EN_PROGRESO, IMPLEMENTADO (todas las que tienen un plan o están en proceso)
        const techImplemented = relevantTech.filter(t => t.status === ImplementationStatus.IMPLEMENTADO).length;
        const techPlanned = relevantTech.filter(t => 
            t.status === ImplementationStatus.PLANIFICADO || 
            t.status === ImplementationStatus.EN_PROGRESO || 
            t.status === ImplementationStatus.IMPLEMENTADO
        ).length;
        
        return {
            totalClients: relevantClients.length,
            avgHealth: relevantClients.length > 0 ? Math.round(relevantClients.reduce((acc, c) => acc + c.health_score, 0) / relevantClients.length) : 0,
            avgTech: calculateTechProgress(relevantTech),
            techImplemented: techImplemented,
            techPlanned: techPlanned,
            avgBi: calculateBiProgress(relevantBi),
            biModelsCount: biModelsCount,
            avgProcess: calculateProcessProgress(processSurveys), // Processes are global
            blocked: relevantTech.filter(ti => ti.status === ImplementationStatus.BLOQUEADO).length +
                     relevantBi.filter(bcp => bcp.status === ImplementationStatus.BLOQUEADO).length,
        };
    }, [clients, techImplementations, biClientPanels, processSurveys, selectedClientId, selectedResponsibleId, selectedGerencia]);
    

    return (
        <div className="flex flex-col h-full lg:overflow-hidden">
            <div className="flex-shrink-0 space-y-2 sm:space-y-4 mb-2 sm:mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Dashboard General</h1>
                    {isAdmin && (
                        <button onClick={handleOpenCreateModal} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 hover:from-orange-500 hover:to-[#FF7E2D] text-white font-bold py-1.5 px-3 sm:py-2 sm:px-5 rounded-lg shadow-md transition-all text-xs sm:text-base whitespace-nowrap">
                            + Crear Cliente
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                    <MetricCard title="Total Clientes" value={kpis.totalClients} colorClasses="from-blue-500 to-blue-600" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952A3 3 0 003 10.5c0-1.657 1.343-3 3-3a3 3 0 003 3v-1.5a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 011.5 1.5v1.5a3 3 0 003 3a3 3 0 003-3a3 3 0 00-3-3m-3.75 3.75z" />} />
                    <MetricCard title="Health Score Prom." value={`${kpis.avgHealth}%`} colorClasses="from-teal-400 to-teal-500" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A59.902 59.902 0 0112 3.493a59.902 59.902 0 0110.399 5.84l-2.072 1.036m-8.322 0A50.57 50.57 0 0112 14.565a50.57 50.57 0 012.158-4.418" />} />
                    <MetricCard title="Herramientas Tech" value={`${kpis.techImplemented} / ${kpis.techPlanned}`} colorClasses="from-purple-400 to-purple-500" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />} />
                    <MetricCard title="Modelos BI" value={kpis.biModelsCount} colorClasses="from-sky-400 to-sky-500" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />} />
                    <MetricCard title="% Avance Procesos" value={`${kpis.avgProcess}%`} colorClasses="from-indigo-400 to-indigo-500" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />} />
                    <MetricCard title="# Bloqueados" value={kpis.blocked} colorClasses="from-red-500 to-red-600" icon={<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />} />
                </div>
            </div>

            <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
                <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-gray-700 flex-shrink-0 px-1 sm:px-0">Matriz de Implementación de Sistemas</h2>
                 <div className="overflow-x-auto overflow-y-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0" style={{ maxHeight: 'none' }}>
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full text-xs sm:text-sm text-left text-gray-500 divide-y divide-gray-200">
                            <thead className="text-[10px] sm:text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 sticky left-0 bg-gray-50 z-10 min-w-[120px] sm:min-w-[200px]">Cliente</th>
                                    <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 min-w-[100px] sm:min-w-[150px]">Responsable</th>
                                    <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-center min-w-[60px] sm:min-w-[100px]">Dotación</th>
                                    {techPlatforms.map(platform => (
                                        <th key={platform.id} scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-center min-w-[60px]">{platform.display_name}</th>
                                    ))}
                                    {isAdmin && <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-center min-w-[80px]">Acción</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedClients.map(client => {
                                    const owner = users.find(u => u.id === client.owner_user_id);
                                    return (
                                    <tr key={client.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 group">
                                        <th scope="row" className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                                            {client.name}
                                        </th>
                                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm whitespace-nowrap text-gray-600">
                                            {owner?.name || 'N/A'}
                                        </td>
                                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-center font-medium text-gray-800">
                                            {client.headcount.toLocaleString('es-CL')}
                                        </td>
                                        {techPlatforms.map(platform => {
                                            const implementation = techImplementations.find(
                                                impl => impl.client_id === client.id && impl.platform_id === platform.id
                                            );
                                            return (
                                                <td key={platform.id} className="px-2 sm:px-6 py-2 sm:py-4 text-center">
                                                    <StatusIcon status={implementation?.status} />
                                                </td>
                                            );
                                        })}
                                        {isAdmin && (
                                            <td className="px-2 sm:px-6 py-2 sm:py-4">
                                                <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                                                    <button onClick={() => handleOpenEditModal(client)} className="text-blue-600 hover:text-blue-800" title="Editar">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                    </button>
                                                    <button onClick={() => deleteClient(client.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={goToPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
            </Card>
            
            <ClientFormModal isOpen={isClientModalOpen} client={editingClient} onClose={() => setClientModalOpen(false)} />
        </div>
    );
};

export default DashboardView;