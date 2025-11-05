import React from 'react';
import { useData } from '../hooks/useData';

export const Header: React.FC = () => {
    const { clients, selectedClientId, setSelectedClientId } = useData();

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClientId(e.target.value);
    };

    return (
        <header className="flex-shrink-0 bg-white shadow-sm p-4 border-b border-gray-200 flex justify-end items-center">
            <div className="w-full max-w-xs">
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
        </header>
    );
};