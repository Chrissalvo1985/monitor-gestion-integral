
import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { NoClientsAccess } from '../components/NoClientsAccess';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { ProgressBar } from '../components/ProgressBar';
import { UsabilityFormModal } from '../components/UsabilityFormModal';
import { filterClients } from '../utils/calculations';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { isSpecificSystem } from '../constants';

const UsabilityView: React.FC = () => {
    const { clients, techPlatforms, techUsability, selectedClientId, selectedResponsibleId, selectedGerencia } = useData();
    const { isAdmin, hasAssignedClients } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingContext, setEditingContext] = useState<{ clientId: string; platformId: string; } | null>(null);

    if (!hasAssignedClients) {
        return <NoClientsAccess />;
    }

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

    const handleOpenModal = (clientId: string, platformId: string) => {
        setEditingContext({ clientId, platformId });
        setModalOpen(true);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Monitor de Usabilidad</h1>
            <Card className="overflow-hidden flex flex-col lg:max-h-[calc(100vh-280px)]">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-700 flex-shrink-0">Usabilidad por Cliente y Sistema</h2>
                 <div className="overflow-x-auto overflow-y-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full text-sm text-left text-gray-500 divide-y divide-gray-200">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-3 sm:px-6 py-3 sticky left-0 bg-gray-50 z-10 min-w-[150px] sm:min-w-[200px] text-left">Cliente</th>
                                    {techPlatforms.map(platform => (
                                        <th key={platform.id} scope="col" className="px-3 sm:px-6 py-3 text-center min-w-[180px] sm:min-w-[200px]">{platform.display_name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedClients.map(client => (
                                    <tr key={client.id} className="bg-white border-b hover:bg-gray-50 group">
                                        <th scope="row" className="px-3 sm:px-6 py-4 font-bold text-gray-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10 text-left">
                                            {client.name}
                                        </th>
                                        {techPlatforms.map(platform => {
                                            const usabilityRecord = techUsability.find(tu => tu.client_id === client.id && tu.platform_id === platform.id);
                                            const usagePct = usabilityRecord?.usage_pct ?? 0;
                                            const usageCount = usabilityRecord?.usage_count ?? 0;
                                            const isSpecific = isSpecificSystem(platform.code);

                                            return (
                                                <td key={platform.id} className="px-3 sm:px-6 py-4">
                                                    {isSpecific ? (
                                                        // Indicador simplificado para sistemas específicos
                                                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                                            <div className="flex-grow min-w-0 text-center">
                                                                <div className="flex items-center justify-center space-x-1.5">
                                                                    {usageCount > 0 && (
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                                    )}
                                                                    <span className="text-sm font-semibold text-gray-800">
                                                                        {usageCount.toLocaleString('es-CL')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {isAdmin && (
                                                                <button onClick={() => handleOpenModal(client.id, platform.id)} className="text-blue-600 hover:text-blue-800 flex-shrink-0" title="Editar Usabilidad">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        // Indicador para sistemas de toda la dotación: porcentaje y barra de progreso
                                                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                                            <div className="flex-grow min-w-0">
                                                                <ProgressBar progress={usagePct} />
                                                                <div className="text-xs text-center mt-1 text-gray-500">
                                                                    {usabilityRecord ? `${usabilityRecord.usage_count.toLocaleString('es-CL')} / ${client.headcount.toLocaleString('es-CL')}` : `0 / ${client.headcount.toLocaleString('es-CL')}`}
                                                                </div>
                                                            </div>
                                                            <span className="font-semibold text-gray-800 w-10 sm:w-12 text-right flex-shrink-0">{usagePct}%</span>
                                                            {isAdmin && (
                                                                <button onClick={() => handleOpenModal(client.id, platform.id)} className="text-blue-600 hover:text-blue-800 flex-shrink-0" title="Editar Usabilidad">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
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

            <UsabilityFormModal 
                isOpen={isModalOpen}
                onClose={() => { setModalOpen(false); setEditingContext(null); }}
                context={editingContext}
            />
        </div>
    );
};

export default UsabilityView;