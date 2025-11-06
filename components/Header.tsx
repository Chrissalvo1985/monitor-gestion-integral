import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Gerencia } from '../types';

export const Header: React.FC = () => {
    const { 
        clients, 
        users,
        selectedClientId, 
        setSelectedClientId,
        selectedResponsibleId,
        setSelectedResponsibleId,
        selectedGerencia,
        setSelectedGerencia
    } = useData();

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClientId(e.target.value);
    };

    const handleResponsibleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedResponsibleId(e.target.value);
    };

    const handleGerenciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGerencia(e.target.value);
    };

    // Obtener responsables únicos de los clientes
    const responsibleUsers = useMemo(() => {
        const responsibleIds = new Set(clients.map(c => c.owner_user_id));
        return users.filter(u => responsibleIds.has(u.id));
    }, [clients, users]);

    // Obtener gerencias únicas
    const gerencias = useMemo(() => {
        return Object.values(Gerencia);
    }, []);

    return (
        <header className="flex-shrink-0 bg-white shadow-sm p-4 border-b border-gray-200 flex justify-end items-center gap-4">
            <div className="w-full max-w-xs">
                <label htmlFor="client-select" className="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
                <select
                    id="client-select"
                    value={selectedClientId || 'all'}
                    onChange={handleClientChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-semibold"
                >
                    <option value="all">Todos los Clientes</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
            </div>
            <div className="w-full max-w-xs">
                <label htmlFor="responsible-select" className="block text-xs font-medium text-gray-700 mb-1">Responsable</label>
                <select
                    id="responsible-select"
                    value={selectedResponsibleId || 'all'}
                    onChange={handleResponsibleChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-semibold"
                >
                    <option value="all">Todos los Responsables</option>
                    {responsibleUsers.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
            <div className="w-full max-w-xs">
                <label htmlFor="gerencia-select" className="block text-xs font-medium text-gray-700 mb-1">Gerencia</label>
                <select
                    id="gerencia-select"
                    value={selectedGerencia || 'all'}
                    onChange={handleGerenciaChange}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-semibold"
                >
                    <option value="all">Todas las Gerencias</option>
                    {gerencias.map(gerencia => (
                        <option key={gerencia} value={gerencia}>{gerencia}</option>
                    ))}
                </select>
            </div>
        </header>
    );
};