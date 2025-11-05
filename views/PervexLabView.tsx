import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/Card';
import { LabEventType, LabEvent } from '../types';
import { LabEventFormModal } from '../components/LabEventFormModal';

const EVENT_TYPE_STYLES: Record<LabEventType, { bg: string, text: string }> = {
    [LabEventType.WORKSHOP]: { bg: 'bg-blue-100', text: 'text-blue-800' },
    [LabEventType.CAPACITACION]: { bg: 'bg-green-100', text: 'text-green-800' },
    [LabEventType.PILOTO]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    [LabEventType.DEMO]: { bg: 'bg-purple-100', text: 'text-purple-800' },
    [LabEventType.RETRO]: { bg: 'bg-gray-200', text: 'text-gray-800' },
};

const PervexLabView: React.FC = () => {
    const { labEvents, clients, users, deleteLabEvent } = useData();
    const { isAdmin } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<LabEvent | null>(null);

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
        <div className="space-y-6">
             <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Pervex Lab</h1>
                {isAdmin && (
                    <button onClick={handleCreate} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all">
                        + Crear Evento
                    </button>
                )}
            </div>

            <Card>
                <h2 className="text-xl font-bold mb-4 text-gray-700">Lista de Eventos</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Tema</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Cliente</th>
                                <th scope="col" className="px-6 py-3">Owner</th>
                                <th scope="col" className="px-6 py-3">Resultados</th>
                                <th scope="col" className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labEvents.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(event => {
                                const client = clients.find(c => c.id === event.client_id);
                                const owner = users.find(u => u.id === event.owner_user_id);
                                const style = EVENT_TYPE_STYLES[event.type];
                                return (
                                    <tr key={event.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">{event.topic}</th>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>{event.type}</span>
                                        </td>
                                        <td className="px-6 py-4">{client?.name || 'General'}</td>
                                        <td className="px-6 py-4">{owner?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{event.outcomes}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {isAdmin && (
                                                    <>
                                                        <button onClick={() => handleEdit(event)} className="text-blue-600 hover:text-blue-800"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
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
            </Card>
            <LabEventFormModal isOpen={isModalOpen} event={editingEvent} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default PervexLabView;