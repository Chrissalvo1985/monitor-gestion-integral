import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/Card';
import { LabEventType, LabEvent } from '../types';
import { LabEventFormModal } from '../components/LabEventFormModal';
import { filterClients } from '../utils/calculations';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

const EVENT_TYPE_STYLES: Record<LabEventType, { bg: string, text: string }> = {
    [LabEventType.WORKSHOP]: { bg: 'bg-blue-100', text: 'text-blue-800' },
    [LabEventType.CAPACITACION]: { bg: 'bg-green-100', text: 'text-green-800' },
    [LabEventType.PILOTO]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    [LabEventType.DEMO]: { bg: 'bg-purple-100', text: 'text-purple-800' },
    [LabEventType.RETRO]: { bg: 'bg-gray-200', text: 'text-gray-800' },
};

const PervexLabView: React.FC = () => {
    const { labEvents, clients, users, deleteLabEvent, selectedClientId, selectedResponsibleId, selectedGerencia } = useData();
    const { isAdmin } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<LabEvent | null>(null);

    const filteredClients = useMemo(() => {
        return filterClients(clients, selectedClientId, selectedResponsibleId, selectedGerencia);
    }, [clients, selectedClientId, selectedResponsibleId, selectedGerencia]);

    const filteredLabEvents = useMemo(() => {
        if (filteredClients.length === 0 && (selectedClientId !== 'all' || selectedResponsibleId !== 'all' || selectedGerencia !== 'all')) {
            return [];
        }
        const filteredClientIds = new Set(filteredClients.map(c => c.id));
        return labEvents.filter(event => {
            if (!event.client_id) return true; // Eventos generales siempre se muestran
            return filteredClientIds.has(event.client_id);
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [labEvents, filteredClients, selectedClientId, selectedResponsibleId, selectedGerencia]);

    const {
        currentPage,
        totalPages,
        itemsPerPage,
        paginatedItems: paginatedEvents,
        totalItems,
        goToPage,
        handleItemsPerPageChange,
    } = usePagination(filteredLabEvents, 10);

    const handleCreate = () => {
        setEditingEvent(null);
        setModalOpen(true);
    };

    const handleEdit = (event: LabEvent) => {
        setEditingEvent(event);
        setModalOpen(true);
    };

    const handleDelete = (eventId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            deleteLabEvent(eventId);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pervex Lab</h1>
                {isAdmin && (
                    <button onClick={handleCreate} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm sm:text-base whitespace-nowrap">
                        + Crear Evento
                    </button>
                )}
            </div>

            <Card className="overflow-hidden flex flex-col max-h-[calc(100vh-250px)] lg:max-h-[calc(100vh-280px)]">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-700 flex-shrink-0">Lista de Eventos</h2>
                <div className="overflow-x-auto overflow-y-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full text-sm text-left text-gray-500 divide-y divide-gray-200">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-3 sm:px-6 py-3 min-w-[100px]">Fecha</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 min-w-[150px]">Tema</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 min-w-[100px]">Tipo</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 min-w-[120px]">Cliente</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 min-w-[120px]">Owner</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 min-w-[200px]">Resultados</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 min-w-[100px]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEvents.map(event => {
                                    const client = clients.find(c => c.id === event.client_id);
                                    const owner = users.find(u => u.id === event.owner_user_id);
                                    const style = EVENT_TYPE_STYLES[event.type];
                                    return (
                                        <tr key={event.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                                            <th scope="row" className="px-3 sm:px-6 py-4 font-medium text-gray-900">{event.topic}</th>
                                            <td className="px-3 sm:px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>{event.type}</span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{client?.name || 'General'}</td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{owner?.name || 'N/A'}</td>
                                            <td className="px-3 sm:px-6 py-4 text-gray-600">{event.outcomes}</td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="flex space-x-2">
                                                    {isAdmin && (
                                                        <>
                                                            <button onClick={() => handleEdit(event)} className="text-blue-600 hover:text-blue-800" title="Editar">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                            </button>
                                                            <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
            <LabEventFormModal isOpen={isModalOpen} event={editingEvent} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default PervexLabView;